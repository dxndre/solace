<?php
/**
 * Template Name: Homepage
 * Description: Page template for the Homepage.
 */

get_header();
the_post();

// ---------- Recursive function to get all Cover blocks ----------
function get_cover_blocks_recursive($blocks, &$cover_blocks = []) {
    foreach ($blocks as $block) {
        if ($block['blockName'] === 'core/cover') {
            $cover_blocks[] = $block;
        }

        if (!empty($block['innerBlocks'])) {
            get_cover_blocks_recursive($block['innerBlocks'], $cover_blocks);
        }
    }
    return $cover_blocks;
}

// ---------- Parse page content and get all Cover blocks ----------
$blocks = parse_blocks(get_post()->post_content);
$cover_blocks = get_cover_blocks_recursive($blocks);
$counter = 1;

if (!empty($cover_blocks)) :
?>
<aside class="project-menu">
    <ul>
        <?php
        foreach ($cover_blocks as $block) {

            // Anchor
            $anchor = isset($block['attrs']['anchor']) ? $block['attrs']['anchor'] : 'project-' . $counter;

            // Default title
            $title = 'Project ' . $counter;

            // Extract <h2> inside .text div
            if (!empty($block['innerBlocks'])) {
                foreach ($block['innerBlocks'] as $inner) {
                    // Cover > Group > Heading
                    if ($inner['blockName'] === 'core/group' && !empty($inner['innerBlocks'])) {
                        foreach ($inner['innerBlocks'] as $groupInner) {
                            if ($groupInner['blockName'] === 'core/heading') {
                                $title = strip_tags(render_block($groupInner));
                                break 2; // stop both loops
                            }
                        }
                    }

                    // Fallback: direct heading inside Cover
                    if ($inner['blockName'] === 'core/heading') {
                        $title = strip_tags(render_block($inner));
                        break;
                    }
                }
            }

            // Get media URL for JS (optional, if using fixed background)
            $media_url = !empty($block['attrs']['url']) ? $block['attrs']['url'] : '';

            echo '<li><a href="#' . esc_attr($anchor) . '" data-media="' . esc_url($media_url) . '">' . esc_html($title) . '</a></li>';
            $counter++;
        }
        ?>
    </ul>
</aside>

<div class="slide-counter-container">
	<div id="slide-counter" aria-label="Slide counter">1 / 1</div>
</div>


<?php endif; ?>


<div id="post-<?php the_ID(); ?>" <?php post_class('content'); ?>>
    <?php
        the_content();

        wp_link_pages(
            array(
                'before'   => '<nav class="page-links" aria-label="' . esc_attr__('Page', 'solace-digital') . '">',
                'after'    => '</nav>',
                'pagelink' => esc_html__('Page %', 'solace-digital'),
            )
        );

        edit_post_link(
            esc_attr__('Edit', 'solace-digital'),
            '<span class="edit-link">',
            '</span>'
        );
    ?>
</div><!-- /#post-<?php the_ID(); ?> -->

<?php
if (comments_open() || get_comments_number()) {
    comments_template();
}

get_footer();
