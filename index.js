var nameArr = new Array(),
    videoDivArr = new Array();

var connection = new RTCMultiConnection();

// this line is VERY_important
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

var predefinedRoomId = prompt('Please enter room-code');
connection.openOrJoin(predefinedRoomId);

connection.extra = {
    fullName: prompt('Please Enter Your Full Name')
};

connection.session = {
    audio: false,
    video: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: true
};

var videosContainer = document.getElementById('section_1');
connection.onstream = function(event) {
    delete event.mediaElement.id; // make sure that below DIV has unique ID in the DOM

    // 교사일 때
    if(connection.extra.fullName.includes('교사')){
        attachStream(event);
    }
    // 학생일 때
    else if(connection.extra.fullName.includes('학생')){
        if(event.extra.fullName.includes('학생')){
            return;
        }
        else if (event.extra.fullName.includes('교사')){
            attachStream(event);
        }
    }
};

connection.onstreamended = function(event) {
	var div = document.getElementById(event.streamid);
	if(div && div.parentNode) {
		div.parentNode.removeChild( div ); // remove it from the DOM
	}
};

connection.addStream({
    screen: true,
    oneway: true,
    streamCallback: function(stream) {
        console.log('Screen is successfully captured: ' + stream.getVideoTracks().length);
    }
});

function attachStream(event){
    const constraints = {
        video: {
            width: 320, // 최대 너비
            //height: 1080, // 최대 높이
            frameRate: 10, // 최대 프레임
        },
    }

    if(!nameArr.includes(event.extra.fullName)){
        var div = document.createElement('div');

        div.id = event.streamid;

        if (event.extra.fullName.includes('교사')) {
            div.className = 'totalTeacherView';
            var teacherDiv = document.createElement('div');
            var teacherID_Div = document.createElement('div');
            teacherDiv.className = 'teacherView';
            teacherID_Div.className = 'teacherID';
            teacherDiv.appendChild(event.mediaElement);
            teacherID_Div.innerHTML = event.extra.fullName;
            div.appendChild(teacherDiv);
            div.appendChild(teacherID_Div);
            videoDivArr.push(teacherDiv);
            nameArr.push(event.extra.fullName);
        }
        else if (event.extra.fullName.includes('학생')) {
            div.className = 'studentView';
            div.appendChild(event.mediaElement); // appending VIDEO to DIV
            var h2 = document.createElement('h2');
            h2.innerHTML = event.extra.fullName;
            div.appendChild(h2);
            videoDivArr.push(div)
            nameArr.push(event.extra.fullName);
        }
        videosContainer.appendChild(div);
    }
    else{
        var div = videoDivArr[nameArr.indexOf(event.extra.fullName)];
        div.insertBefore(event.mediaElement, div.firstChild);
    }
}

// consider the URL as UNIQUE-ROOM-ID
// connection.openOrJoin(connection.channel);