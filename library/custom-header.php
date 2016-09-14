<?php
/**
 * Implement Custom Header functionality for Coming Out 2015
 *
 * @package WordPress
 * @subpackage Coming Out 2015
 * @since Coming Out 2015 1.0
 */

/**
 * Set up the WordPress core custom header settings.
 *
 * @since Coming Out 2015 1.0
 *
 * @uses wizualne_header_style()
 * @uses wizualne_admin_header_style()
 * @uses wizualne_admin_header_image()
 */
function wizualne_custom_header_setup() {
	/**
	 * Filter Coming Out 2015 custom-header support arguments.
	 *
	 * @since Coming Out 2015 1.0
	 *
	 * @param array $args {
	 *     An array of custom-header support arguments.
	 *
	 *     @type bool   $header_text            Whether to display custom header text. Default false.
	 *     @type int    $width                  Width in pixels of the custom header image. Default 175.
	 *     @type int    $height                 Height in pixels of the custom header image. Default 60.
	 *     @type bool   $flex_height            Whether to allow flexible-height header images. Default true.
	 *     @type string $admin_head_callback    Callback function used to style the image displayed in
	 *                                          the Appearance > Header screen.
	 *     @type string $admin_preview_callback Callback function used to create the custom header markup in
	 *                                          the Appearance > Header screen.
	 * }
	 */
	add_theme_support( 'custom-header', apply_filters( 'wizualne_custom_header_args', array(
		'default-text-color'     => '000',
		'width'                  => 204,
		'flex-width'             => true,
		'height'                 => 70,
		'flex-height'            => true,
		'wp-head-callback'       => 'wizualne_header_style',
		'admin-head-callback'    => 'wizualne_admin_header_style',
		'admin-preview-callback' => 'wizualne_admin_header_image',
	) ) );
}
add_action( 'after_setup_theme', 'wizualne_custom_header_setup' );

if ( ! function_exists( 'wizualne_header_style' ) ) :
/**
 * Styles the header image and text displayed on the blog
 *
 * @see wizualne_custom_header_setup().
 *
 */
function wizualne_header_style() {
	$text_color = get_header_textcolor();

	// If no custom color for text is set, let's bail.
	if ( display_header_text() && $text_color === get_theme_support( 'custom-header', 'default-text-color' ) )
		return;

	// If we get this far, we have custom styles.
	?>
	<style type="text/css" id="wizualne-header-css">
	<?php
		// Has the text been hidden?
		if ( ! display_header_text() ) :
	?>
		.site-title,
		.site-description {
			clip: rect(1px 1px 1px 1px); /* IE7 */
			clip: rect(1px, 1px, 1px, 1px);
			position: absolute;
		}
	<?php
		// If the user has set a custom color for the text, use that.
		elseif ( $text_color != get_theme_support( 'custom-header', 'default-text-color' ) ) :
	?>
		.site-title a {
			color: #<?php echo esc_attr( $text_color ); ?>;
		}
	<?php endif; ?>
	</style>
	<?php
}
endif; // wizualne_header_style


if ( ! function_exists( 'wizualne_admin_header_style' ) ) :
/**
 * Style the header image displayed on the Appearance > Header screen.
 *
 * @see wizualne_custom_header_setup()
 *
 * @since Coming Out 2015 1.0
 */
function wizualne_admin_header_style() {
?>
	<style type="text/css" id="wizualne-admin-header-css">
	.appearance_page_custom-header #headimg {
		background-color: #fff;
		border: none;
		max-width: 175px;
		max-height: 60px;
		min-height: 48px;
	}
	#headimg h1 {
		font-family: Lato, sans-serif;
		font-size: 18px;
		line-height: 48px;
		margin: 0 0 0 30px;
	}
	.rtl #headimg h1  {
		margin: 0 30px 0 0;
	}
	#headimg h1 a {
		color: #fff;
		text-decoration: none;
	}
	#headimg img {
		vertical-align: middle;
	}
	</style>
<?php
}
endif; // wizualne_admin_header_style


function include_svg($svg) {
$newABSPATH = str_replace(‘wp/’, ”, ABSPATH);
$newSITEURL = str_replace(‘wp’, ”, site_url());
if ( $svg ) :
$icon = $svg;
if ( strpos( $icon, ‘.svg’ ) !== false ) :
$icon = str_replace( $newSITEURL, ”, $icon);
include($newABSPATH . $icon);
endif;
endif;
}

if ( ! function_exists( 'wizualne_admin_header_image' ) ) :
/**
 * Create the custom header image markup displayed on the Appearance > Header screen.
 *
 * @see wizualne_custom_header_setup()
 *
 * @since Coming Out 2015 1.0
 */
function wizualne_admin_header_image() {
?>
	<div id="headimg">
		<?php if ( get_header_image() ) : ?>
		<img src="<?php header_image(); ?>" alt="">
		<?php endif; ?>
		<h1 class="displaying-header-text"><a id="name"<?php echo sprintf( ' style="color:#%s;"', get_header_textcolor() ); ?> onclick="return false;" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a></h1>
	</div>
<?php
}
endif; // wizualne_admin_header_image
