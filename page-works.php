<?php
/**
 * Template Name: Page (Works)
 * Description: Works Page template full width.
 *
 */

get_header();

?>

<div class="hero-header">
	<div class="container">
		<?php
			if ( has_post_thumbnail() ) {
				the_post_thumbnail( 'full', array( 'class' => 'img-fluid' ) );
			}
		?>
		<h1 class="entry-title"><?php the_title(); ?></h1>
	</div>
</div>

<?php
the_post();
?>

<div class="project-data-bar">
    <div class="project-data-inner">
        <a href="#" class="view-project-btn">View Project</a>
        <div class="film-info">
            <span class="film-title">Film Name</span>
            <span class="film-director">Director</span>
            <span class="film-release">Release Date</span>
        </div>
        <a href="#" class="full-project-link">Full Project</a>
    </div>
</div>

<div id="post-<?php the_ID(); ?>" <?php post_class( 'content' ); ?>>
	<?php
		the_content();

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
