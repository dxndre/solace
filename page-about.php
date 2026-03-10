<?php
/**
 * Template Name: Page (About)
 * Description: About Page template full width.
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

<div class="team-photo-map">
	<section class="group-photo-section">
		<img src="<?php echo get_template_directory_uri(); ?>/assets/img/team.jpg" alt="The Solace Films team">
	</section>

	<button
		class="team-hotspot"
		type="button"
		style="--x: 44%; --y: 33%; --label-x: -170px; --label-y: 44px;"
		aria-label="Raihan Kamal, Director"
	>
		<span class="team-hotspot__dot"></span>
		<span class="team-hotspot__label">
			<strong>Raihan Kamal</strong>
			<em>Director</em>
		</span>
	</button>

	<button
		class="team-hotspot"
		type="button"
		style="--x: 74%; --y: 24%; --label-x: -140px; --label-y: 52px;"
		aria-label="Shavez Khan, Director"
	>
		<span class="team-hotspot__dot"></span>
		<span class="team-hotspot__label">
			<strong>Shavez Khan</strong>
			<em>Director</em>
		</span>
	</button>

	<button
		class="team-hotspot"
		type="button"
		style="--x: 39%; --y: 21%; --label-x: -140px; --label-y: 52px;"
		aria-label="Andew Ukiwa, Graphic Artist"
	>
		<span class="team-hotspot__dot"></span>
		<span class="team-hotspot__label">
			<strong>Andrew Ukiwa</strong>
			<em>Social Branded Entertainment</em>
		</span>
	</button>

	<button
		class="team-hotspot"
		type="button"
		style="--x: 67%; --y: 24%; --label-x: -160px; --label-y: 48px;"
		aria-label="John Doe, Producer"
	>
		<span class="team-hotspot__dot"></span>
		<span class="team-hotspot__label">
			<strong>John Doe</strong>
			<em>Producer</em>
		</span>
	</button>

	<button
		class="team-hotspot"
		type="button"
		style="--x: 30%; --y: 33%; --label-x: -160px; --label-y: 48px;"
		aria-label="John Doe, Producer"
	>
		<span class="team-hotspot__dot"></span>
		<span class="team-hotspot__label">
			<strong>John Doe</strong>
			<em>Producer</em>
		</span>
	</button>

	<button
		class="team-hotspot"
		type="button"
		style="--x: 56%; --y: 34%; --label-x: -160px; --label-y: 48px;"
		aria-label="John Doe, Producer"
	>
		<span class="team-hotspot__dot"></span>
		<span class="team-hotspot__label">
			<strong>John Doe</strong>
			<em>Producer</em>
		</span>
	</button>
</div>

<?php
the_post();
?>


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
