/**
 * jQuery PDF-DOC Plugin
 *
 * LICENSE
 *
 * This source file is subject to the Apache Licence, Version 2.0 that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://dev.funkynerd.com/projects/hazaar/wiki/licence
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@funkynerd.com so we can send you a copy immediately.
 *
 * @copyright   Copyright (c) 2012 Jamie Carl (http://www.funkynerd.com)
 * @license     http://dev.funkynerd.com/projects/hazaar/wiki/licence Apache Licence, Version 2.0
 * @version     0.1
 */

//PDFJS.workerSrc = 'hazaar/js/pdf.js';

PDFJS.disableWorker = true;

(function ( $ ){
	$.fn.PDFDoc = function( options ) {

		var settings = $.extend( {
		      'page'				: 1
		}, options);
		
		if(!settings.source){
		
			$.error('No PDF document source was given');
			
			return this;
				
		}
		
		var mydoc = this;
		
		mydoc.addClass('h-pdf-container');
		
		var canvas_container = $('<div>', { 'class' : 'h-pdf-canvas-container' } );
		
		var canvas = $('<canvas>', { 'class' : 'h-pdf-canvas'});
		
		var toolbar = $('<div>', { 'class' : 'h-pdf-toolbar'});   
		
		var but_next = $('<div>', { 'class' : 'h-pdf-button h-pdf-next' } ).click(function(){
			
			var current_page = mydoc.data('current_page');
			
			current_page++;
			
			renderPage(mydoc.data('pdf'), current_page, canvas.get()[0]);
			
			mydoc.data('current_page', current_page);
			
		});
		
		var but_prev = $('<div>', { 'class' : 'h-pdf-button h-pdf-prev' } ).click(function(){
			
			var current_page = mydoc.data('current_page');
			
			if(current_page > 1){
				
				current_page--;
				
				renderPage(mydoc.data('pdf'), current_page, canvas.get()[0]);
			
			}
			
			mydoc.data('current_page', current_page);
			
		});
		
		var page_text = $('<span>', { 'class' : 'h-pdf-pagetext', 'html' : 'Page:' } );
		
		var page_input = $('<input>', { 'type' : 'text', 'class' : 'h-pdf-pageinput', 'value' : settings.page, 'id' : 'h-page-input' } );
		
		toolbar.append($('<div>').addClass('h-pdf-toolbarPanel').append(but_prev).append(but_next).append(page_text).append(page_input));
		
		mydoc.append(toolbar);
		
		canvas_container.css('height', mydoc.height() - toolbar.height());
		
		mydoc.append(canvas_container.append(canvas));
		
		PDFJS.getDocument(settings.source).then(function(pdf) {
		
			mydoc.data('pdf', pdf);

			renderPage(pdf, settings.page,  canvas.get()[0]);
		  
		});
		
		this.data('current_page', settings.page);
		
		return this;

	};
})( jQuery );

function renderPage(pdf, the_page, canvas){
	
	  // Using promise to fetch the page
	  pdf.getPage(the_page).then(function(page) {
		
	    var scale = 1;
	    
	    var viewport = page.getViewport(scale);
	
	    //
	    // Prepare canvas using PDF page dimensions
	    //
	    //var canvas = document.getElementById('the-canvas');
	    
	    var context = canvas.getContext('2d');
	    
	    canvas.height = viewport.height;
	    
	    canvas.width = viewport.width;
	
	    //
	    // Render PDF page into canvas context
	    //
	    var renderContext = {
	    	
	      canvasContext: context,
	      
	      viewport: viewport
	      
	    };
	    
	    page.render(renderContext);
	    
	    $('#h-page-input').val(the_page);
	    
	  });
	  
}
