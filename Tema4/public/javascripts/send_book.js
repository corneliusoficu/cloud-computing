$(document).ready(()=>{
    var form = document.getElementById("new-book-form");
    
    $('#save-book-button').click(()=>{
        var formData = new FormData(form);
        $.ajax({
            url: '/books',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(response){
                $('.modal').modal('toggle');
                location.reload();
            },
            error: function(error){
                alert(error);
            }
        })
    });    
});
