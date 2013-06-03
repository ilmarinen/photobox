(function($){
	$.fn.photobrowser = function(options){
		plugin_path = options.plugin_path;
		get_photos_url = options.photos_url;
		get_thumbnail_url = options.thumbnail_url;
		//get_photo_url = options.photo_url;
		photobrowser_container = $(this);
		photobrowser_container.load(plugin_path + 'photobrowser_layout.html');
		$(document).ready(function(){
			$.getJSON(get_photos_url, function(result){
				//console.log(result);
				photo_ids = result.photo_ids;
				photoBrowserHtml = '<ul class="thumbnails">';
				for(var i=0; i < photo_ids.length; i++){
				photoBrowserHtml = photoBrowserHtml + 
				'<li class="span4">\
				<div class="thumbnail">\
				  <img style="width: 280px;" src="' + get_thumbnail_url + photo_ids[i] + '" class="img-polaroid"/>\
				  <div class="caption"><p><a id="' + photo_ids[i] + '" href="#" class="edit-btn btn btn-primary">Edit</a> <a href="#" class="delete-btn btn">Delete</a></div>\
				</div>\
				</li>';

				}

                //photoBrowserHtml = photoBrowserHtml + '<div id="photoeditordialog"></div>';
                console.log(photoBrowserHtml);
                $("#photobrowser_thumbnails").html(photoBrowserHtml);
                //$("photoeditordialog").html(plugin_path + 'modal_edit_form.html');


				$(".edit-btn").click(function(){
					$("#dialog_thumbnail_img").attr("src", get_thumbnail_url + this.id);
					$("#editphotoDialog").modal({show: true});
				});

				$("#photobrowser_upload_form").attr("action", get_photos_url);

			});

		});
    
    };
})(jQuery);

