<?php
/**
 * Theme setup and custom functionality for Solace Digital
 */

// Include Theme Customizer
$theme_customizer = __DIR__ . '/inc/customizer.php';
if (is_readable($theme_customizer)) {
    require_once $theme_customizer;
}

if (!function_exists('solace_digital_setup_theme')) {
    function solace_digital_setup_theme() {
        load_theme_textdomain('solace-digital', __DIR__ . '/languages');

        global $content_width;
        if (!isset($content_width)) {
            $content_width = 800;
        }

        add_theme_support('title-tag');
        add_theme_support('automatic-feed-links');
        add_theme_support('post-thumbnails');
        add_theme_support('html5', [
            'search-form', 'comment-form', 'comment-list', 'gallery',
            'caption', 'script', 'style', 'navigation-widgets'
        ]);
        add_theme_support('wp-block-styles');
        add_theme_support('align-wide');
        add_theme_support('editor-styles');
        add_editor_style('style-editor.css');

        update_option('image_default_align', 'none');
        update_option('image_default_link_type', 'none');
        update_option('image_default_size', 'large');

        add_filter('use_default_gallery_style', '__return_false');
    }
    add_action('after_setup_theme', 'solace_digital_setup_theme');

    function solace_digital_load_editor_styles() {
        if (is_admin()) {
            wp_enqueue_style('editor-style', get_theme_file_uri('style-editor.css'));
        }
    }
    add_action('enqueue_block_assets', 'solace_digital_load_editor_styles');

    remove_action('enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets');
    remove_action('enqueue_block_editor_assets', 'gutenberg_enqueue_block_editor_assets_block_directory');
}

// Backwards compatibility for wp_body_open
if (!function_exists('wp_body_open')) {
    function wp_body_open() {
        do_action('wp_body_open');
    }
}

// Add custom user fields
if (!function_exists('solace_digital_add_user_fields')) {
    function solace_digital_add_user_fields($fields) {
        $fields['facebook_profile'] = 'Facebook URL';
        $fields['twitter_profile']  = 'Twitter URL';
        $fields['linkedin_profile'] = 'LinkedIn URL';
        $fields['xing_profile']     = 'Xing URL';
        $fields['github_profile']   = 'GitHub URL';
        return $fields;
    }
    add_filter('user_contactmethods', 'solace_digital_add_user_fields');
}

// Check if current page is blog
function is_blog() {
    global $post;
    $posttype = get_post_type($post);
    return (is_archive() || is_author() || is_category() || is_home() || is_single() || (is_tag() && ('post' === $posttype)));
}

// Disable comments on media
function solace_digital_filter_media_comment_status($open, $post_id = null) {
    $media_post = get_post($post_id);
    if ('attachment' === $media_post->post_type) {
        return false;
    }
    return $open;
}
add_filter('comments_open', 'solace_digital_filter_media_comment_status', 10, 2);

// Style edit links
function solace_digital_custom_edit_post_link($link) {
    return str_replace('class="post-edit-link"', 'class="post-edit-link badge bg-secondary"', $link);
}
add_filter('edit_post_link', 'solace_digital_custom_edit_post_link');

function solace_digital_custom_edit_comment_link($link) {
    return str_replace('class="comment-edit-link"', 'class="comment-edit-link badge bg-secondary"', $link);
}
add_filter('edit_comment_link', 'solace_digital_custom_edit_comment_link');

// Responsive oEmbed
function solace_digital_oembed_filter($html) {
    return '<div class="ratio ratio-16x9">' . $html . '</div>';
}
add_filter('embed_oembed_html', 'solace_digital_oembed_filter', 10);

// Content navigation
if (!function_exists('solace_digital_content_nav')) {
    function solace_digital_content_nav($nav_id) {
        global $wp_query;
        if ($wp_query->max_num_pages > 1) {
            echo '<div id="' . esc_attr($nav_id) . '" class="d-flex mb-4 justify-content-between">';
            echo '<div>' . get_next_posts_link('<span aria-hidden="true">&larr;</span> ' . esc_html__('Older posts', 'solace-digital')) . '</div>';
            echo '<div>' . get_previous_posts_link(esc_html__('Newer posts', 'solace-digital') . ' <span aria-hidden="true">&rarr;</span>') . '</div>';
            echo '</div>';
        } else {
            echo '<div class="clearfix"></div>';
        }
    }

    function posts_link_attributes() {
        return 'class="btn btn-secondary btn-lg"';
    }
    add_filter('next_posts_link_attributes', 'posts_link_attributes');
    add_filter('previous_posts_link_attributes', 'posts_link_attributes');
}

// Register sidebars
function solace_digital_widgets_init() {
    $sidebars = [
        'primary_widget_area'   => 'Primary Widget Area (Sidebar)',
        'secondary_widget_area' => 'Secondary Widget Area (Header Navigation)',
        'third_widget_area'     => 'Third Widget Area (Footer)',
    ];
    foreach ($sidebars as $id => $name) {
        register_sidebar([
            'name'          => $name,
            'id'            => $id,
            'before_widget' => '',
            'after_widget'  => '',
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
        ]);
    }
}
add_action('widgets_init', 'solace_digital_widgets_init');

// Nav menus
if (function_exists('register_nav_menus')) {
    register_nav_menus([
        'main-menu'   => 'Main Navigation Menu',
        'footer-menu' => 'Footer Menu',
    ]);
}

// Include custom nav walkers
$custom_walker = __DIR__ . '/inc/wp-bootstrap-navwalker.php';
if (is_readable($custom_walker)) require_once $custom_walker;

$custom_walker_footer = __DIR__ . '/inc/wp-bootstrap-navwalker-footer.php';
if (is_readable($custom_walker_footer)) require_once $custom_walker_footer;

// Enqueue styles and scripts
function solace_digital_scripts_loader() {
    $theme_version = wp_get_theme()->get('Version');

    wp_enqueue_style('style', get_theme_file_uri('style.css'), [], $theme_version);
    wp_enqueue_style('main', get_theme_file_uri('build/main.css'), [], $theme_version);
    if (is_rtl()) wp_enqueue_style('rtl', get_theme_file_uri('build/rtl.css'), [], $theme_version);

    wp_enqueue_script('mainjs', get_theme_file_uri('build/main.js'), [], $theme_version, true);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }

    // Swiper
    wp_enqueue_style('swiper-css', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', [], null);
    wp_enqueue_script('swiper-js', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', [], null, true);
    wp_add_inline_script('swiper-js', 'document.addEventListener("DOMContentLoaded", function() {
        new Swiper(".my-post-carousel", {
            slidesPerView: 3,
            spaceBetween: 20,
            grabCursor: true,
            loop: true,
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            pagination: { el: ".swiper-pagination", clickable: true },
        });
    });');
}
add_action('wp_enqueue_scripts', 'solace_digital_scripts_loader');

// Shortcode: [now_playing]
function now_playing_shortcode($atts) {
    $atts = shortcode_atts(['title' => 'Now Playing', 'quote' => '“I always knew you were special”'], $atts, 'now_playing');
    ob_start(); ?>
    <div class="now-playing">
        <div class="play-icon"><i class="fa-solid fa-circle-play"></i></div>
        <div class="text-side">
            <h3><?php echo esc_html($atts['title']); ?></h3>
            <span><?php echo esc_html($atts['quote']); ?></span>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('now_playing', 'now_playing_shortcode');

// Shortcode: [person_job_title]
function shortcode_person_job_title($atts) {
    $atts = shortcode_atts(['id' => '', 'slug' => ''], $atts, 'person_job_title');
    $post_id = !empty($atts['id']) ? intval($atts['id']) : (!empty($atts['slug']) ? get_page_by_path(sanitize_title($atts['slug']), OBJECT, 'person')->ID ?? null : get_the_ID());
    if (!$post_id || get_post_type($post_id) !== 'person') return '';
    $job_title = get_field('job_title', $post_id);
    return $job_title ? '<span class="person-job-title">' . esc_html($job_title) . '</span>' : '';
}
add_shortcode('person_job_title', 'shortcode_person_job_title');

// Shortcode: [post_carousel]
function my_post_type_carousel_shortcode($atts) {
    $atts = shortcode_atts(['post_type' => 'post', 'posts_per_page' => 6], $atts);
    $query = new WP_Query(['post_type' => $atts['post_type'], 'posts_per_page' => $atts['posts_per_page']]);
    ob_start();
    if ($query->have_posts()) : ?>
        <div class="swiper my-post-carousel">
            <div class="swiper-wrapper">
                <?php while ($query->have_posts()) : $query->the_post(); ?>
                    <div class="swiper-slide">
                        <a href="<?php the_permalink(); ?>">
                            <?php if (has_post_thumbnail()) the_post_thumbnail('medium'); ?>
                            <h3><?php the_title(); ?></h3>
                        </a>
                    </div>
                <?php endwhile; ?>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-pagination"></div>
        </div>
    <?php endif;
    wp_reset_postdata();
    return ob_get_clean();
}
add_shortcode('post_carousel', 'my_post_type_carousel_shortcode');

// Solace Film Query Loop: inject data attributes
add_filter('render_block', function($block_content, $block) {
    if (empty($block['blockName']) || $block['blockName'] !== 'core/post-template') return $block_content;
    libxml_use_internal_errors(true);
    $doc = new DOMDocument();
    $doc->loadHTML('<?xml encoding="utf-8" ?>' . $block_content);
    foreach ($doc->getElementsByTagName('li') as $li) {
        if (preg_match('/post-(\d+)/', $li->getAttribute('class'), $matches)) {
            $post_id = intval($matches[1]);
            if (get_post_type($post_id) !== 'solace-film') continue;
            $title = esc_attr(get_the_title($post_id));
            $director = esc_attr(get_field('director', $post_id));
            $release_full = get_field('release_date', $post_id);
            $release_year = $release_full ? date('Y', strtotime($release_full)) : 'TBC';
            $url = esc_url(get_permalink($post_id));
            $li->setAttribute('data-title', $title ?: 'Untitled');
            $li->setAttribute('data-director', $director ?: 'Unknown');
            $li->setAttribute('data-release', $release_year ?: 'TBC');
            $li->setAttribute('data-url', $url);
        }
    }
    $body = $doc->getElementsByTagName('body')->item(0);
    $output = '';
    foreach ($body->childNodes as $child) $output .= $doc->saveHTML($child);
    return $output;
}, 10, 2);

// Appending video preview for thumbnails in homepage

add_filter('render_block', function($block_content, $block) {

    // Only affect Featured Image blocks inside Query Loops
    if ($block['blockName'] !== 'core/post-featured-image') {
        return $block_content;
    }

    // Get the post ID for this tile
    $post = get_post();
    if (!$post) return $block_content;

    $post_id = $post->ID;

    // ACF: video_preview (file field)
    $video_file = get_field('video_preview', $post_id);

    // No video? Return original block
    if (!$video_file || empty($video_file['url'])) {
        return $block_content;
    }

    // Build video HTML
    $video_html = '
        <div class="video-preview">
            <video autoplay muted loop playsinline>
                <source src="' . esc_url($video_file['url']) . '" type="' . esc_attr($video_file['mime_type'] ?? 'video/mp4') . '">
            </video>
        </div>';

    // 1. Remove the existing thumbnail <img>
    $block_content = preg_replace('/<img[^>]*>/i', '', $block_content);

    // 2. Inject video before </figure>
    $block_content = str_replace('</a>', $video_html . '</a>', $block_content);

    return $block_content;

}, 10, 2);



/**
 * Custom Comment Form & Password Form
 */

// Bootstrap 5 Comment Form
function solace_digital_bootstrap_comment_form($fields) {
    $commenter = wp_get_current_commenter();
    $req = get_option('require_name_email');
    $aria_req = ($req ? " required aria-required='true'" : '');

    $fields = [
        'author' => '<div class="mb-3"><label for="author" class="form-label">Name *</label>' .
                    '<input id="author" name="author" type="text" class="form-control" value="' . esc_attr($commenter['comment_author']) . '" ' . $aria_req . '></div>',

        'email'  => '<div class="mb-3"><label for="email" class="form-label">Email *</label>' .
                    '<input id="email" name="email" type="email" class="form-control" value="' . esc_attr($commenter['comment_author_email']) . '" ' . $aria_req . '></div>',

        'url'    => '<div class="mb-3"><label for="url" class="form-label">Website</label>' .
                    '<input id="url" name="url" type="url" class="form-control" value="' . esc_attr($commenter['comment_author_url']) . '"></div>',
    ];

    return $fields;
}
add_filter('comment_form_default_fields', 'solace_digital_bootstrap_comment_form');

function solace_digital_bootstrap_comment_textarea($args) {
    $args['comment_field'] = '<div class="mb-3"><label for="comment" class="form-label">Comment</label>' .
                             '<textarea id="comment" name="comment" class="form-control" rows="5" required></textarea></div>';
    $args['class_submit'] = 'btn btn-primary';
    return $args;
}
add_filter('comment_form_defaults', 'solace_digital_bootstrap_comment_textarea');

// Bootstrap 5 Password Form for Protected Posts
function solace_digital_password_form() {
    global $post;
    $label = 'pwbox-' . (empty($post->ID) ? rand() : $post->ID);

    $form = '<form class="post-password-form mb-3" action="' . esc_url(site_url('wp-login.php?action=postpass', 'login_post')) . '" method="post">
        <p class="mb-2">This content is password protected. To view it, please enter the password below:</p>
        <div class="input-group mb-3">
            <input name="post_password" id="' . $label . '" type="password" class="form-control" placeholder="Password">
            <button type="submit" class="btn btn-primary">Submit</button>
        </div>
    </form>';

    return $form;
}
add_filter('the_password_form', 'solace_digital_password_form');