$(document).ready(function() {
  var $formToggle = $('#form-toggle');
  var $addProductForm = $('#add-product-form');
  var toggling = 0
  var tableToggling = 0
  var $productName = $('#product-name');
  var $productPrice = $('#product-price');
  var $productDescription = $('#product-description');
  var $productQuantity = $('#product-quantity');
  var $productColor = $('#product-color');
  var $productWeight = $('#product-weight');
  var $getProducts = $('#get-products');
  var $products = $('#products');
  var $productsTable = $('#products-table');
  var $viewProducts = $('#view-products');
  var $getNullProducts = $('#get-null-products');
  var $nullProducts = $('#null-products');
  var $showBox = $('#show-box');
  var $showCancel = $('#show-cancel');
  var $productNameShow = $('#product_name_show');
  var $productPriceShow = $('#product_price_show');
  var $productQuantityShow = $('#product_quantity_show');
  var $productDescriptionShow = $('#product_description_show');
  var $productColorShow = $('#product_color_show');
  var $productWeightShow = $('#product_weight_show');
  var $closeBox = $('#close');
  var BASEURL = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1';


  $formToggle.click(function(){
    if(toggling % 2 === 0) {
      $addProductForm.css('display', 'block');
      toggling += 1
      $formToggle.text('Finished Adding');
      $addProductForm[0].reset();
    } else if(toggling % 2 === 1) {
      $addProductForm.css('display', 'none');
      toggling += 1
      $formToggle.text('Add Product');
    }
  })

  $getProducts.click(function() {
    loadProducts()
  });

  $viewProducts.click(function() {
    if(tableToggling % 2 === 0) {
      $productsTable.css('display', 'block');
      tableToggling += 1
      $viewProducts.text('Hide Products');
    } else if(tableToggling % 2 === 1) {
      $productsTable.css('display', 'none');
      tableToggling += 1
      $viewProducts.text('See Products');
    }

  });

  $addProductForm.submit(function(e){
    e.preventDefault();
    var requestType, requestUrl;
    if($(this).data('product-id')) {
      requestType = "PUT";
      requestUrl = BASEURL + '/products/' + $(this).data('product-id');
    } else {
      requestType = "POST";
      requestUrl = BASEURL + '/products';
    }
    $.ajax({
      type: requestType,
      url: requestUrl,
      dataType: 'JSON',
      data: { product: {
        name: $productName.val(),
        base_price: $productPrice.val(),
        description: $productDescription.val(),
        quantity_on_hand: $productQuantity.val(),
        color: $productColor.val(),
        weight: $productWeight.val()
      }}
    }).success(function(data){
      $addProductForm[0].reset();
      $productName.focus();
      loadProducts()
    }).fail(function(data) {

    });
  });

  $(document).on('click', '.show-product', function() {
    var productId = $(this).parent().attr('id')
    $.ajax({
      type: "GET",
      url: BASEURL + '/products/' + productId,
      dataType: 'JSON'
    }).success(function(data) {
      $productNameShow.text(data.name);
      $productPriceShow.text(data.base_price);
      $productQuantityShow.text(data.quantity_on_hand);
      $productDescriptionShow.text(data.description);
      $productColorShow.text(data.color);
      $productWeightShow.text(data.weight);
      $showBox.css('display', 'block');
      $showCancel.css('display', 'block')
    }).fail(function(data) {

    });
  });

  $closeBox.click(function() {
    $showBox.css('display', 'none');
    $showCancel.css('display', 'none')
  })

  $showCancel.click(function() {
    $showBox.css('display', 'none');
    $showCancel.css('display', 'none')
  })

  $(document).on('click', '.delete-product', function() {
    console.log($(this).parent().attr('id'))
    var productId = $(this).parent().attr('id')
    $.ajax({
      type: 'DELETE',
      url: BASEURL + '/products/' + productId,
      dataType: 'JSON'
    }).success(function(data) {
      $("#" + productId).remove()
    }).fail(function(data) {

    });
  });

  $(document).on('click', '.edit-product', function() {
    var productId = $(this).parent().attr('id')
    $.ajax({
      type: 'GET',
      url: BASEURL + '/products/' + productId,
      dataType: 'JSON'
    }).success(function(data) {
      if(toggling % 2 === 0) {
        $addProductForm.css('display', 'block');
        toggling += 1
        $formToggle.text('Finished Adding');
      }
      $productName.val(data.name).focus();
      $productPrice.val(data.base_price);
      $productDescription.val(data.description);
      $productQuantity.val(data.quantity_on_hand);
      $productColor.val(data.color);
      $productWeight.val(data.weight);
      $addProductForm.attr('data-product-id', productId);

    }).fail(function(data) {

    });
  });

  function loadProducts() {
    $products.empty();
    $.ajax({
      type: 'GET',
      url: BASEURL + '/products',
      dataType: 'JSON'
    }).success(function(data) {
      for(var i = 0; i < data.length; i++) {
        var product = data[i];
        // $products.append('<div id=' + product.id + '>' + product.name + '</div>');
        if(product.quantity_on_hand > 0) {
          $products.append('<tr class="row" id=' + product.id + '>' + '<td class="col s3">' + product.name.substr(0,21) + '</td>'
                            + '<td class="col s3">' + product.quantity_on_hand + '</td>'
                            + '<td class="col s3">' + '$ ' + product.base_price + '</td>'
                            + '<td class="col s1 show-product">' + 'View' + '</td>'
                            + '<td class="col s1 edit-product">' + 'Edit' + '</td>'
                            + '<td class="col s1 delete-product">' + 'Delete' + '</td>'
                            + '</tr>')
        }
      }

    }).fail(function(data) {
    });
  }

  $getNullProducts.click(function() {
    $products.empty();
    $.ajax({
      type: 'GET',
      url: BASEURL + '/products',
      dataType: 'JSON'
    }).success(function(data) {
      for(var i = 0; i < data.length; i++) {
        var product = data[i];
        // $products.append('<div id=' + product.id + '>' + product.name + '</div>');
        if(product.quantity_on_hand <= 0 || product.quantity_on_hand === null) {
          $products.append('<tr class="row" id=' + product.id + '>' + '<td class="col s3">' + product.name.substr(0,21) + '</td>'
                            + '<td class="col s3">' + product.quantity_on_hand + '</td>'
                            + '<td class="col s3">' + "$ " + product.base_price + '</td>'
                            + '<td class="col s1 show-product">' + 'View' + '</td>'
                            + '<td class="col s1 edit-product">' + 'Edit' + '</td>'
                            + '<td class="col s1 delete-product">' + 'Delete' + '</td>'
                            + '</tr>')
        }
      }

    }).fail(function(data) {
    });
  });

});
