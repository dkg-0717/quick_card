import pipwerks from './SCORM_API_wrapper';
var scorm,lmsConnected,success=false;
var completionstatus ;
function initCourse(){
	console.log(">>initCourse")
	if(!lmsConnected){
		try{
			scorm = pipwerks.SCORM;
		}catch(exception){
			console.log(exception)
		}
		scorm.version="1.2";//SABA no detecta bien la version del scorm entonces se le especifica.
		lmsConnected = scorm.init();
		console.log("scorm:",scorm)
		console.log("connected:",lmsConnected)
		
		if(lmsConnected){//cmi.core.lesson_status
			  var completionstatus = scorm.status("get");
			  console.log("completion status",completionstatus)
		      if(completionstatus == "completed"){
		         handleError("You have already completed this course. You do not need to continue.");
		      }
		      else{
		      	if (completionstatus == null) { 
			      		success = scorm.set("cmi.core.lesson_status", "incomplete"); }
			      		commit();
			     }
		   } else {
		      handleError("Error: Course could not connect with the LMS");
		   }
	}
}

function setScore(score){
	console.log("setScore")
	success = scorm.set("cmi.score.raw",score); 
	commit();
}

function getBookmark(){
	if(lmsConnected){
		console.log("get bookmark from parent",scorm.get("cmi.core.lesson_location"))
		return scorm.get("cmi.core.lesson_location");
		//return window.parent.GetBookmark();
	}else{
		return localStorage.getItem("bookmark-smnyl"); 
	}
}

function setBookmark(bookmark){
	if(lmsConnected){
		success = scorm.set("cmi.core.lesson_location",bookmark);
		commit();
	}else{
		 localStorage.setItem("bookmark-smnyl",bookmark); 
	}
}


function finishCourse(successStatus){
	console.log("Finis");
	if(lmsConnected){
		// success = scorm.set("cmi.core.lesson_status", "completed");
		success = scorm.set("cmi.core.lesson_status",successStatus); 
		completionstatus= "completed";
		commit();
      if(success){
        // scorm.quit();
      } else {
         handleError("Error: Course could not be set to complete!");
      }
   } else {
      handleError("Error: Course is not connected to the LMS");
   }
}


function commit() {
	console.log("success",success)
	if(success){
		scorm.save();
	}
	else {
		console.log("SERVER ERROR")
		console.log(scorm.debug.getCode())
		console.log(scorm.debug.getInfo(scorm.debug.getCode()))
	}
	//console.log("after")
}

function handleError(msg){
	//alert(msg)
	console.log(msg)
}

window.onbeforeunload=function(e){
	
	quit()
}

function quit(){
   if(completionstatus === "completed"){
      scorm.set("cmi.core.exit", "logout");
   } else {
      scorm.set("cmi.core.exit", "suspend");
   }
   scorm.quit();
}

export  {
	initCourse,
	finishCourse
};