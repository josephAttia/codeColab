navigator.getUserMedia (
    // constraints
    {
       video: true,
       audio: true
    },
 
    // successCallback
    function(localMediaStream) {
       var video = document.querySelector('video');
       video.src = window.URL.createObjectURL(localMediaStream);
       video.onloadedmetadata = function(e) {
          // Do something with the video here.
       };
    },
 
    // errorCallback
    function(err) {
     if(err === PERMISSION_DENIED) {
       // Explain why you need permission and how to update the permission setting
     }
    }
 );