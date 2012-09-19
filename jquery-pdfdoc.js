//PDFJS.workerSrc = 'hazaar/js/pdf.js';

PDFJS.disableWorker = true;

var global_pdf;

var current_page = 1;

(function ( $ ){
	$.fn.PDFDoc = function( options ) {

		var settings = $.extend( {
		      'page'				: 1
		}, options);
		
		if(!settings.source){
		
			$.error('No PDF document source was given');
			
			return this;
				
		}
		
		var container = $('<div>').addClass('h-pdf-container');
		
		var canvas = $('<canvas>').addClass('h-pdf-canvas');
		
		var toolbar = $('<div>').addClass('h-pdf-toolbar')   
		
		var but_next = $('<button>').html('Next').click(function(){
			
			current_page++;
			
			renderPage(global_pdf, current_page, canvas.get()[0]);
			
		});
		
		var but_prev = $('<button>').html('Prev').click(function(){
			
			if(current_page > 1){
				
				current_page--;
				
				renderPage(global_pdf, current_page, canvas.get()[0]);
			
			}
			
		});
		
		toolbar.append(but_prev).append(but_next);
		
		container.append(toolbar).append(canvas);
		
		this.html(container);

		current_page = settings.page;
		
		showPDF(settings.source, canvas.get()[0], current_page);
		
		return this;

	};
})( jQuery );

function showPDF(source, canvas, the_page){
	
	//
	// Fetch the PDF document from the URL using promices
	//
	PDFJS.getDocument(source).then(function(pdf) {
		
	  global_pdf = pdf;
	
	  renderPage(pdf, the_page, canvas);
	  
	});
	
}

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
	    
	  });
	  
}
