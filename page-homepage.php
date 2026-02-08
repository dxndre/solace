<?php
/**
 * Template Name: Homepage (New)
 * Description: Page template Homepage.
 *
 */

get_header();
the_post();
?>

<?php
// Grab ACF fields
$video_preview = get_field('video_preview');
$image_preview = get_field('image_preview');
$film_type     = get_field('film_type');
$release_date  = get_field('release_date');
$producer      = get_field('producer');
$director      = get_field('director');
?>

<div id="post-<?php the_ID(); ?>" <?php post_class( 'content' ); ?>>
	<?php
		echo '<div class="film-oscillator-wrap">';
			the_content(); 
		echo '</div>';


		wp_link_pages(
			array(
				'before'   => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'solace-digital' ) . '">',
				'after'    => '</nav>',
				'pagelink' => esc_html__( 'Page %', 'solace-digital' ),
			)
		);
		edit_post_link(
			esc_attr__( 'Edit', 'solace-digital' ),
			'<span class="edit-link">',
			'</span>'
		);
	?>
</div><!-- /#post-<?php the_ID(); ?> -->
<?php
	// If comments are open or we have at least one comment, load up the comment template.
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}

get_footer();