/* My module for this webapp templates */

define(['underscore'], function(_){

  return {

    // a jQuery listview separator element
    listSeparator : 
      _.template('<li data-role="list-divider"><%= text %></li>')
    ,

    // a jQuery listview link element (to put inside a li)
    listElement : 
      _.template('<a href="<%= href %>">' +
                 '<%= title %>' +
                 '<span class="ui-li-count"><%= count %></span>' +
                 '</a>'),

    // a jQuery listview link element with icon (to put inside a li)
    listElementWithIcon : 
      _.template('<a href="<%= href %>">' +
                 '<img src="<%= src %>" class="ui-li-icon"></img>' +
                 '<%= title %>' +
                 '<span class="ui-li-count"><%= count %></span>' +
                 '</a>'),
                                  
    // a jQuery listview read-only element
    roListElement : 
      _.template('<li class="ui-li-static"><%= text %></li>'),

    // the content of a LI element for an article
    articleLiElement : 
      _.template('<a href="<%= href %>">' +
      '<h3><%= title %></h3>' +
      '<p class="ui-li-desc"><%= date %></p></a>'),

    articleLiElementWithIcon : 
      _.template('<a href="<%= href %>">' +
      '<img src="<%= img %>" class="ui-li-icon"></img><h3><%= title %>' +
	  '<object><a target="_blank" style="color: inherit;" href="<%= articlelink %>"><span style="float: right; opacity: 0.6;" class="extra ui-li-desc"><%= date %></span></a></object>' +
	  '</h3></a>'),

    // the content of a LI element for an article with the feed Name
    articleFeedLiElement : 
      _.template(
        '<a href="<%= href %>">' +
        '<h3><%= title %></h3>' +
        '<p class="ul-li-desc"><strong><%= feed %></strong></p>' +
        '<p class="ui-li-desc"><%= date %></p></a>'
      ),

    articleFeedLiElementWithIcon : 
      _.template(
        '<a href="<%= href %>">' +
        '<img src="<%= img %>" class="ui-li-icon"></img><h3 class="article-list-article-title-only"><%= title %></h3>' +
        '<p class="ul-li-desc"><%= date %><span style="float: right;max-width: 50%;" class="extra ui-li-desc"><%= feed %></span></p>' +
        '</a>'
      ),

    // button for the prev/next
    gridLeftButton : 
      _.template(
        '<div class="ui-grid-a">' +
        '<div class="ui-block-a">' +
        '<a data-role="button" data-icon="arrow-l" href="<%= href %>" class="<%= cl %>">previous</a>' +
        '<em><%= title %></em></div>'),

    gridRightButton : 
      _.template(
        '<div class="ui-block-b">' +
        '<a data-role="button" data-icon="arrow-r" ' +
        'data-iconpos="right" href="<%= href %>" class="<%= cl %>"' +
        '>next</a><em><%= title %></em></div>' +
        '</div>')

  } //return

}); //define
