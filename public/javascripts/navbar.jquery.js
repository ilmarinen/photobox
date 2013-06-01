(function($){
	$.fn.navbar = function(options){
		navbar_container = $(this);
		navbar_container.addClass("navbar hide");
		active_item = options.active_item;
		$.getJSON(options.get_menu_url, function(navbar_data){
			menu_items = navbar_data.menu_items;
			dropdown_title = navbar_data.dropdown_title;
			dropdown_items = navbar_data.dropdown_items;
			menu_list_html = '<ul class="nav">';
			for(var i = 0; i < menu_items.length; i++){
				menu_item_name = menu_items[i].item_name;
				menu_item_url = menu_items[i].item_url;
				if(menu_item_name == active_item){
					menu_list_html = menu_list_html + '<li class="active"><a href="' + menu_item_url + '">' + menu_item_name + '</a></li>';
				}
				else{
					menu_list_html = menu_list_html + '<li><a href="' + menu_item_url + '">' + menu_item_name + '</a></li>';
				}
			}
			menu_list_html = menu_list_html + '</ul>';

			dropdown_menu_html = '<div class="btn-group pull-right"><a class="btn dropdown-toggle" data-toggle="dropdown" href="#">' + dropdown_title
			 + '<span class="caret"></span></a><ul class="dropdown-menu">';
			for(var i = 0; i < dropdown_items.length; i++){
				dropdown_menu_html = dropdown_menu_html + '<li><a href="' + dropdown_items[i].item_url + '">' + dropdown_items[i].item_name + '</a></li>';
			}
			dropdown_menu_html = dropdown_menu_html + '</ul></div>';
			navbar_container.html('<div class="navbar-inner">' + menu_list_html + dropdown_menu_html + '</div>');
			navbar_container.removeClass('hide');
		});
	}
})(jQuery);
