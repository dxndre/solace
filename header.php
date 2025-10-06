<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<?php wp_head(); ?>
</head>

<?php
	$navbar_scheme   = get_theme_mod( 'navbar_scheme', 'navbar-light bg-light' ); // Get custom meta-value.
	$navbar_position = get_theme_mod( 'navbar_position', 'static' ); // Get custom meta-value.

	$search_enabled  = get_theme_mod( 'search_enabled', '1' ); // Get custom meta-value.
?>

<body <?php body_class(); ?>>

<div id="splash-screen">
  <div class="splash-content">
    <img class="splash-logo" src="<?php echo esc_url( get_stylesheet_directory_uri() . '/logo.png' ); ?>" 
         alt="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" />
    <div class="splash-loader">
      <span id="splash-percent">0%</span>
    </div>
	<div class="progress-bar">
		<div class="progress-fill"></div>
		</div>
  </div>
</div>

<?php wp_body_open(); ?>

<a href="#main" class="visually-hidden-focusable"><?php esc_html_e( 'Skip to main content', 'solace-digital' ); ?></a>

<div id="wrapper">
	<header>
		<nav id="header" class="navbar solace-navbar navbar-expand-md <?php 
			if ( isset( $navbar_position ) && 'fixed_top' === $navbar_position ) {
				echo ' fixed-top';
			} elseif ( isset( $navbar_position ) && 'fixed_bottom' === $navbar_position ) {
				echo ' fixed-bottom';
			}
				if ( is_home() || is_front_page() ) {
				echo ' home';
			}
		?>">
			<div class="container d-flex align-items-center justify-content-between">

				<!-- Left Menu -->
				<div class="menu-left d-none d-md-flex">
					<?php
						wp_nav_menu( array(
							'theme_location' => 'menu-left',
							'menu_class'     => 'navbar-nav me-auto mb-2 mb-lg-0 navbar-left',
							'container'      => false,
							'depth'          => 1,
							'walker'         => new WP_Bootstrap_Navwalker(),
							'fallback_cb'    => false,
						) );
					?>
				</div>

				<!-- Logo -->
				<a class="navbar-brand mx-auto" href="<?php echo esc_url( home_url() ); ?>" rel="home">
					<?php if ( ! empty( $header_logo ) ) : ?>
						<img src="<?php echo esc_url( $header_logo ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" />
					<?php elseif ( file_exists( get_stylesheet_directory() . '/logo.png' ) ) : ?>
						<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/logo.png' ); ?>" 
         alt="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" />
					<?php else : ?>
						<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>
					<?php endif; ?>
				</a>

				<!-- Right Menu -->
				<div class="menu-right d-none d-md-flex">
					<?php
						wp_nav_menu( array(
							'theme_location' => 'menu-right',
							'menu_class'     => 'navbar-nav ms-auto mb-2 mb-lg-0 navbar-right',
							'container'      => false,
							'depth'          => 1,
							'walker'         => new WP_Bootstrap_Navwalker(),
							'fallback_cb'    => false,
						) );
					?>
				</div>

				<!-- Mobile Menu Toggle -->
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle navigation', 'solace-digital' ); ?>">
					<span class="navbar-toggler-icon"></span>
				</button>

				<!-- Mobile Menu -->
				<div id="mobileNav">
				<!-- <div id="mobileNav" class="collapse navbar-collapse"> -->
					<?php
						wp_nav_menu( array(
							'theme_location' => 'main-menu',
							'menu_class'     => 'navbar-nav me-auto mb-2 mb-lg-0',
							'container'      => false,
							'walker'         => new WP_Bootstrap_Navwalker(),
						) );
					?>
				</div>

			</div>
		</nav>

	</header>

	<main id="main" class=""<?php if ( isset( $navbar_position ) && 'fixed_top' === $navbar_position ) : echo ' style="padding-top: 0px;"'; elseif ( isset( $navbar_position ) && 'fixed_bottom' === $navbar_position ) : echo ' style="padding-bottom: 100px;"'; endif; ?>>
		<?php
			// If Single or Archive (Category, Tag, Author or a Date based page).
			if ( is_single() || is_archive() ) :
		?>
			<div class="row">
				<div class="col-md-8 col-sm-12">
		<?php
			endif;
		?>

