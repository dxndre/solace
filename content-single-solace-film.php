<?php
/**
 * The template for displaying Film content in the single.php template.
 */
?>

<?php
// Grab ACF fields
$video_preview = get_field('video_preview');
$image_preview = get_field('image_preview');
$film_type     = get_field('film_type');
$release_year  = get_field('release_year');
$producer      = get_field('producer');
$director      = get_field('director');
?>

<div class="film-hero-header">
    <?php if ( $video_preview ) : ?>
        <video class="film-hero-video" autoplay muted loop playsinline poster="<?php echo esc_url($image_preview ? $image_preview['url'] : ''); ?>">
            <source src="<?php echo esc_url($video_preview['url']); ?>" type="<?php echo esc_attr($video_preview['mime_type']); ?>">
        </video>
    <?php elseif ( $image_preview ) : ?>
        <div class="film-hero-image" style="background-image: url('<?php echo esc_url($image_preview['url']); ?>');"></div>
    <?php endif; ?>

    <div class="container">
        <div class="film-details">
            <h1 class="entry-title"><?php the_title(); ?></h1>
			<div class="little-details">
				<?php if ( $release_year ) : ?>
					<span class="release-year"><?php echo esc_html($release_year); ?></span>
				<?php endif; ?>
				<?php if ( $film_type && $release_year ) : ?>
					<span class="separator">|</span>
				<?php endif; ?>
					<span class="film-type"><?php echo esc_html($film_type); ?></span>		
			</div>
        </div>

		
    </div>


</div>

<div class="container">
	<div class="film-meta-container">
		<ul class="film-meta-columns">
			<?php if ( $producer ) : ?>
				<li>
					<div class="meta-label">Producer</div>
					<div class="meta-value"><?php echo esc_html($producer); ?></div>
				</li>
			<?php endif; ?>

			<?php if ( $director ) : ?>
				<li>
					<div class="meta-label">Director</div>
					<div class="meta-value"><?php echo esc_html($director); ?></div>
				</li>
			<?php endif; ?>
		</ul>
	</div>

	<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<div class="entry-content">
			<?php

			the_content();

			wp_link_pages(
				array(
					'before' => '<div class="page-link"><span>' . esc_html__( 'Pages:', 'solace-digital' ) . '</span>',
					'after'  => '</div>',
				)
			);
			?>
		</div><!-- /.entry-content -->

		<?php
			edit_post_link( __( 'Edit', 'solace-digital' ), '<span class="edit-link">', '</span>' );
		?>

		
	</article><!-- /#post-<?php the_ID(); ?> -->
</div>

