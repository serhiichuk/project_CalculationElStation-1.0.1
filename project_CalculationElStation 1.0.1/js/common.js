// ininial interact.js plugin
interact('.item_icon')
  .draggable({
    snap: {
      targets: [
        interact.createSnapGrid({ x: 25, y: 25 })
      ],
      range: Infinity
    },
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "#_work_space",
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener, 
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        x = x - x%25;
        y = y - y%25;

        
    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    showCurrentItem (target);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;


// ------------------------------------------ end initial --------------------------------------




var Elements = {};
var count_t = 1, count_g = 1, count_c = 1;;

$( document ).ready(function() {

// Add element to work space and create objects
  $('#btn_add').on('click', function () {
    var id = $('.tab-pane.active').attr('id');
    var type = $('.tab-pane.active').attr('data-type');
    var parameters = $('.tab-pane.active > .input-group > input');
    var name_item = $('.tab-pane.active > p').text();   
         
    switch(type) {
      case 'generator': var name = ''+ id + '-'+ count_g++ +''; 
        $('#_work_space').append('<div class="item_icon" data-name="'+ name +'"><img src="img/items/generator.svg"/></div>');
        addToItemsList (name_item, name)
      break;

      case 'transformator': var name = ''+ id + '-'+ count_t++ +'';
        $('#_work_space').append('<div class="item_icon" data-name="'+ name +'"><img src="img/items/t2.svg"/></div>');
        addToItemsList (name_item, name)
      break;

      case 'shina': var name = ''+ id + '-'+ count_c++ +'';
        $('#_work_space').append('<div class="item_icon resizable_def" data-name="'+ name +'"></div>');
        $('#btn_shina').addClass('btn_change')
        $('#btn_shina').removeClass('disabled');
        addToItemsList (name_item, name)
      break;

      case 'conductor': var name = ''+ id + '-'+ count_c++ +'';
        $('#_work_space').append('<svg class="item_icon svg" data-name="'+ name +'" width="100px" height="25px"><line x1="0" y1="12" x2="1000" y2="12" style="stroke-width: 1.8; stroke: black;"></line></svg>');
        addToItemsList (name_item, name)

      break;
    }

    // Create object width Elements
    Elements[name] = {};
    $.each( parameters, function(i){
      var parameter = parameters[i].dataset.param;
      var value = parameters[i].defaultValue;
    
      Elements[name][parameter] = value;
      
    });
  });

// change size in SHINA
  $('.items-space').on('click','.btn_change', function () {
    if ( $('.resizable_def').hasClass('resizable_custom') ) {
      $('.resizable_def').removeClass('resizable_custom');
      $('.resizable_def').removeClass('ui-resizable-cont');
      $('.resizable_def').addClass('item_icon');
      $('.resizable_def').css('border', 'solid 2px');
      $('.btn_change').css({'background-color': '#fff', 'color': '#000'} );
    } else {
      $('.resizable_def').addClass('resizable_custom');
      $('.resizable_def').removeClass('item_icon');
      $('.resizable_def').css('border', 'dashed 2px');
      $('.btn_change').css({'background-color': '#337ab7', 'color': '#fff'} );
    }
  });

//delegate resistable blocks
  $('body').on('click','.resizable_custom', function() {
    $(this).css('border', 'dashed 2px #337ab7' );
    
    $(this).addClass('ui-resizable-cont');
    $(this).resizable({
      grid: [25.4,  25],
      maxHeight: "25",
      minWidth: "50",
      autoHide: 'true'     
    });
  });

// Delete Elements
  $('body').on('click','.del', function() {
    var element = $(this).attr('data-name');
    delete Elements[element];

    $(this).parent().remove();
    $('#_work_space > [data-name = ' + element +']').remove()
  });


});
//-----------------------------END--------------------------

function addToItemsList (name_item, data) {
  $('#Items_list').append('<p>'+ name_item +'<span class="del" data-name="'+ data +'"></span></p>');
}

function showCurrentItem (item) {
  $('#Items_list > p').removeClass('active_item');
  item = $(item).attr('data-name');
  $('#Items_list > p > [data-name = ' + item +']').parent().addClass('active_item');
  console.log();
}