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
 * @version     0.5
 */

//PDFJS.workerSrc = 'hazaar/js/pdf.js';

PDFJS.disableWorker = true;

(function ( $ ){
    $.fn.PDFDoc = function( options ) {

        renderPage = function (pdf, the_page, canvas, scale){
            
              // Using promise to fetch the page
              pdf.getPage(the_page).then(function(page) {
                
                var viewport = page.getViewport(scale);
            
                var context = canvas.getContext('2d');
                
                canvas.height = viewport.height;
                
                canvas.width = viewport.width;
            
                page.render( { canvasContext: context, viewport: viewport } );
                
                $('#h-page-input').val(the_page);
                
              });
              
        }

        var settings = $.extend( {
              'page'                : 1,
              'scale'               : 1
        }, options);
        
        if(!settings.source){
        
            $.error('No PDF document source was given');
            
            return this;
                
        }
        
        var mydoc = this;
        
        var page_count = 0;
        
        mydoc.addClass('h-pdf-container');
        
        var canvas_container = $('<div>', { 'class' : 'h-pdf-canvas-container' } );
        
        var canvas = $('<canvas>', { 'class' : 'h-pdf-canvas'});
        
        var toolbar = $('<div>', { 'class' : 'h-pdf-toolbar'});   
        
        var but_next = $('<div>', { 'class' : 'h-pdf-button h-pdf-next', 'title' : 'Next Page' } ).click(function(){
            
            var current_page = mydoc.data('current_page');
            
            if(current_page < page_count){
            
                current_page++;
            
                renderPage(mydoc.data('pdf'), current_page, canvas.get()[0], mydoc.data('scale'));
                
            }
            
            mydoc.data('current_page', current_page);
            
        });
        
        var but_prev = $('<div>', { 'class' : 'h-pdf-button h-pdf-prev', 'title' : 'Previous Page' } ).click(function(){
            
            var current_page = mydoc.data('current_page');
            
            if(current_page > 1){
                
                current_page--;
                
                renderPage(mydoc.data('pdf'), current_page, canvas.get()[0], mydoc.data('scale'));
            
            }
            
            mydoc.data('current_page', current_page);
            
        });
        
        var page_text = $('<span>', { 'class' : 'h-pdf-pagetext', 'html' : 'Page:' } );
        
        var page_input = $('<input>', { 'type' : 'text', 'class' : 'h-pdf-pageinput', 'value' : settings.page, 'id' : 'h-page-input' } );
        
        var of_text = $('<span>', { 'class' : 'h-pdf-pagetext', 'html' : 'of ' });
        
        var pages_text = $('<span>', { 'class' : 'h-pdf-pagecount', 'html' : page_count, 'id' : 'pagecount' });
        
        var nav = $('<div>').addClass('h-pdf-toolbarPanel')
            .append(but_prev)
            .append(but_next)
            .append(page_text)
            .append(page_input)
            .append(of_text)
            .append(pages_text);
        
        
        
        var zoomModes = { 3 : '300%', 2 : '200%', 1.5 : '150%', 1 : 'Actual Size', 0.5 : 'Half Size', 0.25 : '25%', 0.1 : '10%' };
        
        var zoom = $('<select>', { 'class' : 'h-pdf-zoom' } );
        
        $.each( zoomModes, function(key, value) {
               
            var op = zoom.append($("<option></option>").attr("value",key).text(value));
            
        });
        
        zoom.change(function(){
           
           var scale = $(this).val();
           
           renderPage(mydoc.data('pdf'), mydoc.data('current_page'), canvas.get()[0], scale);
           
           mydoc.data('scale', scale);
        });
        
        nav.append(zoom.val(settings.scale));
        
        toolbar.append(nav);
        
        mydoc.append(toolbar);
        
        var resize_canvas = function(){
            
            canvas_container.css('height', mydoc.height() - toolbar.height());
            
        }
        
        resize_canvas();
        
        mydoc.append(canvas_container.append(progress));
        
        var progress = $('<div>', { 'class' : 'h-pdf-progress' } );
        
        progress.css( { top : (canvas_container.height() / 2) - (progress.height() / 2), left : (canvas_container.width() / 2) - (progress.width() / 2) } );
        
        progress.append($('<div>', { 'class' : 'h-pdf-progress-bar' } ).append($('<div>', { 'class' : 'h-pdf-progress-bar-overlay' } )));
        
        canvas_container.append(progress);
        
        PDFJS.getDocument(settings.source).then(
            function getDocumentCallback(pdf) {
        
                canvas_container.html(canvas);
                
                page_count = pdf.numPages;
                
                $('#pagecount').html(page_count);
                
                mydoc.data('pdf', pdf);
    
                renderPage(pdf, settings.page,  canvas.get()[0], settings.scale);
              
            },
            function getDocumentError(message, exception) {
                
                
            },
            function getDocumentProgress(progressData) {
                
                var pct = 100 * (progressData.loaded / progressData.total);
                
                progress.children('div').css('width', pct + '%');
                
            }
        );
        
        this.data('current_page', settings.page);
        
        this.data('scale', settings.scale);
        
        $(window).resize(function(){
            
            resize_canvas();
            
        });
        
        return this;

    };
})( jQuery );
