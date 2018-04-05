$(document).ready(function(){
   
    $('#getPhotoBtn').click(function(){
        
        console.log('am data click pe get');
        $.ajax({
            url: "/pictures/"+$('#getPhotoName').val(),
            method: "get",
            success: function(response){
                if(response){
                    $('#ceamaipoza').attr('src',response);
                }else{
                    alert('Photo get failed');
                }
            }
        });
    });
});
