<?php
/**
 * The Template for displaying all single film posts.
 */

get_header(); ?>

<main id="primary" class="site-main">
    <?php
    while ( have_posts() ) :
        the_post();

        get_template_part( 'content', 'single-solace-film' );

    endwhile;
    ?>
</main>

<?php get_footer(); ?>
