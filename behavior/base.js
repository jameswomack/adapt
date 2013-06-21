
  
$(function() {
  var bartender, cover, uncoverer;
  
  cover = {
    element : $('div#cover')
  };
  
  bartender = {
    element : $('div#bar'),
    button : $('div#bar button'),
    height  : function () {
      var height = this.element.height();
      height += parseInt(this.element.css("padding-top"), 10) + parseInt(this.element.css("padding-bottom"), 10); //Total Padding Width
      height += parseInt(this.element.css("margin-top"), 10) + parseInt(this.element.css("margin-bottom"), 10); //Total Margin Width
      height += parseInt(this.element.css("borderTopWidth"), 10) + parseInt(this.element.css("borderBottomWidth"), 10); //Total Border Width
      return height;
    }
  };
  
  uncoverer = {
    element : $('div#uncover'),
    show    : function () {
      var top = bartender.height();
      cover.element.animate({
        opacity: 0
      }, 200);
      this.element.css({display:'block'});
      this.element.animate({
        top: top,
        opacity: 1
      });
    },
    hide    : function () {
      var top = -($('body').height());
      cover.element.animate({
        opacity: 1
      }, 1000);
      this.element.animate({
        top: top,
        opacity: 0
        },
        {complete: function () {
          $(this).css({display:'none'});
        }
      });
    },
    start  : function () {
      var top = -($('body').height());
      this.element.css({
        top: top,
        opacity: 0,
        display:'none'
      });
    }
  };

  uncoverer.start();
  
  var show = false;
  
  bartender.button.parent().click(function () {
    show = !show;
    if (show) {
      uncoverer.show();
      bartender.button.addClass('flip');
    }
    else {
      uncoverer.hide();
      bartender.button.removeClass('flip');
    }
  });
  
  var currentProject = 0;
  var currentImage = 0;  
  var projectCount = 0;
  var imageCount = 0;
      
  var projectMaker = function (project) {
    var templateString = '<h2 class="name">'+project['name']+'</h2><p class="description">'+project['desciption']+'</p><p class="ui_directions">Press an image directly below to see another in '+project['name']+'</p><div class="images" alt="Images for project '+project['name']+'" title="'+project['name']+'"></div><p class="project_next">Next Project &#10145;</p>';
    var template = $(templateString);
    return template;
  };
  
  var projectsMaker = function (projects) {
    var projectsElement = $('div#projects');
    var i = 0;
    projects.forEach(function (project) {
      var projectChildElements = projectMaker(project);
      var projectElement = $('<div id="project_'+i+'" class="project"></div>');
      projectChildElements.appendTo(projectElement);
      projectsElement.append(projectElement);
      for (var j = 1; j <= project['image_count']; j++) {
        $('#project_'+i+' .images').append($('<img src="appearance/images/'+project['image_prefix']+'_0'+j+'.jpg" class="project_image"/>'));
      }
      i++;
    });
  };
  
  $.getJSON('/data/projects.json', function (data, textStatus, jqXHR) {
    projectsMaker(data);
    projectCount = data.length;
    $('.project').eq(currentProject).fadeIn();
    imageCount = $('.project').eq(currentProject).find('.project_image').length;
    
    $('p.project_next').click(function () {
      if (currentProject === projectCount-1) {
        currentProject = 0;
      } else {
        currentProject = currentProject+1;        
      }
      $('.project').each(function (index) {
        if (index === currentProject) {
          $(this).fadeIn();
          imageCount = $(this).find('.project_image').length;
        }
        else {
          $(this).fadeOut();
        }
      });
      $('.project').eq(currentProject).find('.project_image').eq(currentImage).show();
    });
    
    $('.project').eq(currentProject).find('.project_image').eq(currentImage).show();
    
    $('.project_image').click(function () {
      console.log(currentImage);
      if (currentImage === imageCount-1) {
        currentImage = 0;
      } else {
        currentImage = currentImage+1;        
      }
      
      $('.project_image').fadeOut();
            
      $('.project').eq(currentProject).find('.project_image').each(function (index) {
        if (index === currentImage) {
          $(this).fadeIn();
        }
      });
    });
    
    $('body').on("keypress", function(e) {

      if (e.which === 32 && show) {
          $('p.project_next').eq(currentProject).click();
          e.preventDefault();
      }
      
      if (e.which === 112) {
          bartender.button.parent().click();
          e.preventDefault();
      }
    });
    
  });
});