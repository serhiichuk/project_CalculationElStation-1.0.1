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
    onmove: dragMoveListener
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
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;
// ------------------------------------------ end initial --------------------------------------

$( document ).ready(function() {
  $('#btn_add').on('click', function () {
    var a = $('.tab-pane.active').attr('id');
    var parameters = $('.tab-pane.active > .input-group > input');
    console.log(parameters);


    $.each( parameters, function(i){
      console.log(''+ parameters[i].offsetParent.firstElementChild.innerText +' '+ +parameters[i].defaultValue +''  );
    });
  });
});


