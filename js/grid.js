/*
* debouncedresize: special jQuery event that happens once after a window resize
*
* latest version and complete README available on Github:
* https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*/
var $event = $.event,
$special,
resizeTimeout;

$special = $event.special.debouncedresize = {
	setup: function() {
		$( this ).on( "resize", $special.handler );
	},
	teardown: function() {
		$( this ).off( "resize", $special.handler );
	},
	handler: function( event, execAsap ) {
		// Save the context
		var context = this,
			args = arguments,
			dispatch = function() {
				// set correct event type
				event.type = "debouncedresize";
				$event.dispatch.apply( context, args );
			};

		if ( resizeTimeout ) {
			clearTimeout( resizeTimeout );
		}

		execAsap ?
			dispatch() :
			resizeTimeout = setTimeout( dispatch, $special.threshold );
	},
	threshold: 250
};


/********************************************************** EXPANDING GRID ************************************************************/


var Grid = (function() {

		/********************* start settings *********************/

		var $grid = $( '.expanding-grid' ),
		// the items
		$items = $grid.children( 'li' ),
		// current expanded item's index
		current = -1,
		// position (top) of the expanded item
		// used to know if the preview will expand in a different row
		previewPos = -1,
		// extra amount of pixels to scroll the window
		scrollExtra = 0,
		// extra margin when expanded (between preview overlay and the next items)
		marginExpanded = 70,
		$window = $( window ), winsize,
		$body = $( 'html, body' ),
		// transitionend events
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support for csstransitions
		support = Modernizr.csstransitions,
		// default settings
		settings = {
			minHeight : 100,
			speed : 350,
			easing : 'ease'
		};

		function init(config) {

		settings = $.extend( true, {}, settings, config );


		/********************* end settings *********************/

			//get window size
			getWinSize();

			//set the data value for each item to closed
			setToClosed($items);

			//calcualte all the heights and apply them
			setItemHeights($items);

			//when you click the close X, close the drawer or open when you click anything in .outer-content
			$items.on( 'click', 'span.close', function() {
				var $item = $( this ).parent().parent().parent();
				$('li').removeClass('notransition');
				$('div').removeClass('notransition');
				closeDrawer($item);
				return false;
			} ).children( '.outer-content' ).on( 'click', function(e) {


				var $item = $( this ).parent();

				// // check if item already opened
				// if(current === $item.index()){
				// 	closeDrawer($item);
				// }else{
				// 	//Close all drawers
				// 	setToClosed($items);
				// 	openDrawer($item);
				// }

				// check if item clicked is already opened
				if(current === $item.index()){

					//if it's already open, then close


					$('li').removeClass('notransition');
					$('div').removeClass('notransition');

					closeDrawer($item);




				}else{

					//if a different drawer is open that is not the one that was clicked on
					if(current !== -1){



						//get the old open drawer
						var $openDrawer = $('.open-drawer');

						//if the old open drawer and the new opening drawer are in the same row
						if(inSameRow($openDrawer, $item)){

							$items.each(function() {
								var $rowItem = $(this);
								var itemsInRow = [];
								if(inSameRow($openDrawer, $rowItem)){
									itemsInRow.push($rowItem);
								}

								for(i=0; i <= itemsInRow.length; i++){
									$(itemsInRow[i]).addClass('notransition');
									$(itemsInRow[i]).children('.inner-content').addClass('notransition');
								}

							});

							closeDrawer($openDrawer);
							openDrawer($item);


							// //if old drawer and new drawer are of equal height
							// if(sameHeight($openDrawer, $item)){



								// //open the outer content of the new drawer, but do it instantly (no animation) so that
								// //the heights of the outer content for the old and new drawer are equal
								// instantOpenOuterContent($item);

								// //open the new inner content
								// openInnerContent($item);

								// //delay closing the old drawer so that the new drawer has time to open all the way
								// setTimeout(function() {
								// 	//close the old drawer
								// 	closeInnerContent($openDrawer);
								// 	closeOuterContent($openDrawer);
								// 	//reset the current index to the new drawer
								// 	current = getIndex();
								// },settings.speed);




							// }else{
							// 	closeDrawer($openDrawer);
							// 	openDrawer($item);
							// }

						//else close the old open drawer and open the new drawer
						}else{

							closeDrawer($openDrawer);
							openDrawer($item);
						}

					//else no drawers are open, therefore open the new drawer.
					}else{
						openDrawer($item);


					}
				}

				return false;

		} );

		$window.on( 'debouncedresize', function() {

			//get new heights on window resize

			setItemHeights($items);
			updateHeights($items);

		});


	}





	/********************* functions *********************/

	function getWinSize() {
		winsize = { width : $window.width(), height : $window.height() };
	}

	function setItemHeights($items) {

		$items.each( function() {
			var $item = $( this );
			$item.data( 'offsetTop', $item.offset().top);
			if($item.data('open')) {
				$item.data( 'outerContentCloseHeight', $item.children('.outer-content').height());
				$item.children('.inner-content').css('height', 'auto');
				$item.data( 'innerContentHeight', $item.children('.inner-content').height());
				$item.children('.inner-content').css('height', $item.data('innerContentHeight'));
				$item.data( 'outerContentOpenHeight', $item.data( 'outerContentCloseHeight' ) + $item.data( 'innerContentHeight' ));
				$item.children('.outer-content').css('height', $item.data('outerContentOpenHeight'));
			}else{
				$item.data( 'outerContentCloseHeight', $item.children('.outer-content').height());
				$item.css('height', $item.data('outerContentCloseHeight'));
				$item.children('.inner-content').css('height', 'auto');
				$item.data( 'innerContentHeight', $item.children('.inner-content').height());
				$item.children('.inner-content').css('height', 0);
				$item.data( 'outerContentOpenHeight', $item.data( 'outerContentCloseHeight' ) + $item.data( 'innerContentHeight' ));
			}

		});
	}

	function setToClosed($items){
		$items.each(function() {
			var $item = $(this);
			$item.data("opened", false);
			closeDrawer($item);
		})
	}


	function openDrawer($item){
		current = $item.index();
		$item.data("opened", true);
		$item.addClass('open-drawer');
		$item.children('.inner-content').css('height', $item.data('innerContentHeight'));
		$item.css('height', $item.data('outerContentOpenHeight'));
		updateViewPosition($item);
	}

	function closeDrawer($item){
		current = -1;
		getClosedHeights($item);
		$item.data("opened", false);
		$item.removeClass('open-drawer');
	}

	function getOpenHeights($item){
		$item.children('.inner-content').css('height', $item.data('innerContentHeight'));
		$item.css('height', $item.data('outerContentOpenHeight'));
	}

	function getClosedHeights($item){
		$item.children('.inner-content').css('height', 0);
		$item.css('height', $item.data('outerContentCloseHeight'));
	}

	function updateHeights($items){
		$items.each(function() {
			var $item = $(this);
			if($item.data("opened")){
				$item.children('.inner-content').css('height', $item.data('innerContentHeight'));
				$item.css('height', $item.data('outerContentOpenHeight'));
			}else{
				$item.css('height', "");
				$item.css('height', $item.data('outerContentClosedHeight'));
			}
		})
	}

	function updateViewPosition($item){
		var position = $item.data( 'offsetTop' ),
			previewOffsetT = $item.data( 'offsetTop' )
			// scrollVal = $item.data( 'outerContentOpenHeight' ) + marginExpanded <= winsize.height
			// 	? position
			// 	: this.height < winsize.height
			// 		? previewOffsetT - ( winsize.height - this.height )
			// 		: previewOffsetT;

			$body.animate( { scrollTop : position }, settings.speed );
	}


	function inSameRow($openDrawer, $item){
		if ($openDrawer.data('offsetTop') === $item.data('offsetTop')){
			return true;
		}
	}

	function sameHeight($openDrawer, $item){
		if($openDrawer.data('outerContentOpenHeight') === $item.data('outerContentOpenHeight')){
			return true;
		}else{
			return false;
		}
	}

	function openOuterContent($item){
		$item.css('height', $item.data('outerContentOpenHeight'));
	}

	function closeOuterContent($item){
		$item.css('height', $item.data('outerContentCloseHeight'));
	}

	function openInnerContent($item){
		$item.children('.inner-content').css('height', $item.data('innerContentHeight'));
		$item.data("opened", true);
		$item.addClass('open-drawer');
		$item.children('.inner-content').css('z-index', '999');
	}

	function closeInnerContent($item){
		$item.children('.inner-content').css('height', 0);
		$item.data("opened", false);
		$item.removeClass('open-drawer');
		$item.children('.inner-content').css('z-index', '');
	}

	function instantOpenOuterContent($item){
		$item.addClass('notransition');
		$item.css('height', $item.data('outerContentOpenHeight'));
		$item.removeClass('notransition');
	}

	function getIndex(){
		return $('.open-drawer').index();
	}

	function removeTransitions(){

	};

	return {
		init : init
	};




})();







