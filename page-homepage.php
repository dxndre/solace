<?php
/**
 * Template Name: Homepage (New)
 * Description: Page template Homepage.
 *
 */

get_header();
the_post();

// Query all films
$films_query = new WP_Query(
	array(
		'post_type'      => 'solace-film',
		'posts_per_page' => -1,
		'post_status'    => 'publish',
		'orderby'        => 'menu_order date',
		'order'          => 'DESC',
	)
);

$film_ids = $films_query->posts ? wp_list_pluck( $films_query->posts, 'ID' ) : array();

// Randomise once per page load
if ( ! empty( $film_ids ) ) {
	shuffle( $film_ids );
}

// Set row count
$row_count = wp_is_mobile() ? 5 : 4;

// Split posts into rows
$rows = array_fill( 0, $row_count, array() );

foreach ( $film_ids as $index => $film_id ) {
	$row_index = $index % $row_count;
	$rows[ $row_index ][] = $film_id;
}
?>

<div id="post-<?php the_ID(); ?>" <?php post_class( 'content' ); ?>>
	<?php
		echo '<div class="film-oscillator-wrap">';
			?>
			<section class="wp-block-group mosaic-section">
				<div class="wp-block-group__inner-container is-layout-constrained wp-block-group-is-layout-constrained">
					<div class="wp-block-query is-layout-flow wp-block-query-is-layout-flow">

						<ul class="columns-3 mosaic-columns wp-block-post-template is-layout-grid wp-block-post-template-is-layout-grid">
							<?php foreach ( $film_ids as $film_id ) : ?>
								<?php echo solace_render_film_tile( $film_id ); ?>
							<?php endforeach; ?>
						</ul>

						<?php foreach ( $rows as $row_index => $row_posts ) : ?>
							<?php if ( empty( $row_posts ) ) : ?>
								<?php continue; ?>
							<?php endif; ?>

							<div class="oscillating-row <?php echo ( $row_index % 2 === 0 ) ? 'scroll-left' : 'scroll-right'; ?>">
								<?php
								// Duplicate each row 3x for a longer seamless loop
								for ( $set = 0; $set < 3; $set++ ) :
									foreach ( $row_posts as $film_id ) :
										echo solace_render_film_tile( $film_id );
									endforeach;
								endfor;
								?>
							</div>
						<?php endforeach; ?>

					</div>
				</div>
			</section>
			<?php
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

wp_reset_postdata();

get_footer();