let fs = require('fs');
let Canvas = require('canvas');

let args = process.argv;

let tempArgs = [];

for(let i=2;i<args.length;i++){
	tempArgs.push(args[i]);
}

args = tempArgs;

if(args.length!=5){ throw new Error("Error 5 arguments expected, "+args.length+" recieved."); }

let path = args[0];
let command = args[1];
let input = args[2];
let input2 = args[3];
let output = args[4];

if(input.substring(0,3) != "C:/"){ input = path + '/' + input; }
if(input2.substring(0,3) != "C:/"){ input2 = path + '/' + input2; }
if(output.substring(0,3) != "C:/"){ output = path + '/' + output; }

console.log('path == ',path);
console.log('command == ',command);
console.log('input == ',input);
console.log('input2 == ',input2);
console.log('output == ',output);


if(command=="comp"){
	
	function loadOut(input,input2,output){
		console.log(input, ' + ' , input2 , ' => ',output);
		fs.readFile(input,function(err,data){
			if (err) throw err;
			var img = new Canvas.Image; // Create a new Image
			img.onload = ()=>{
				//console.log('Image loaded.');
				fs.readFile(input2,function(err,data){
					var img2 = new Canvas.Image; // Create a new Image
					img2.onload = ()=>{
						//console.log('2nd Image loaded.');
						var canvas = new Canvas.Canvas(img.width,img.height);
						var ctx = canvas.getContext('2d');
						ctx.drawImage(img,0,0,img.width,img.height);
						ctx.drawImage(img2,0,0,img2.width,img2.height);
						const buffer = canvas.toBuffer("image/png");
						console.log("output : ",output);//," buffer : ",buffer);
						fs.writeFileSync(output,buffer);
					};
					img2.src = data;
				});
			};
			img.src = data;
		});
	}
	if(fs.lstatSync(input).isDirectory() && fs.lstatSync(input2).isDirectory() && fs.lstatSync(output).isDirectory()){
		let list = fs.readdirSync(input);
		let list2 = fs.readdirSync(input2);
		let i=0;
		if(list.length!=list2.length){
			console.log("Could not comp image sequences, they are of unequal length");
			throw new Error();
		}
		for(let item of list){
			let item2 = list2[i];
			loadOut(input+'/'+item , input2+'/'+item2 , output+'/'+item);
			i++;
		}
	}
	else if(!fs.lstatSync(input).isDirectory() && !fs.lstatSync(input2).isDirectory() && !fs.lstatSync(output).isDirectory()){//is file
		loadOut(input,input2,output);
	}
	else if(!fs.lstatSync(input).isDirectory() && fs.lstatSync(input2).isDirectory() && fs.lstatSync(output).isDirectory()){
		let list = fs.readdirSync(input2);
		for(let item of list){
			loadOut(input , input2+'/'+item , output+'/'+item);
		}
	}
	else{
		console.log('Error: inputs and/or output mismatch. All three are not of the same kind (either file or directory) and they are not of the types file,directory,directory.');
		throw new Error();
	}
}
else if(command=="match"){
	function loadOut(input,input2,output){
		console.log(input, ' + ' , input2 , ' => ',output);
		fs.readFile(input,function(err,data){
			if (err) throw err;
			var img = new Canvas.Image; // Create a new Image
			img.onload = ()=>{
				//console.log('Image loaded.');
				fs.readFile(input2,function(err,data){
					var img2 = new Canvas.Image; // Create a new Image
					img2.onload = ()=>{
						//console.log('2nd Image loaded.');
						var canvas = new Canvas.Canvas(img.width,img.height);
						var ctx = canvas.getContext('2d');
						ctx.drawImage(img,0,0,img.width,img.height);
						let imageData = ctx.getImageData(0,0,img.width,img.height);
						ctx.clearRect(0,0,img.width,img.height);
						ctx.drawImage(img2,0,0,img.width,img.height);
						let matchImageData = ctx.getImageData(0,0,img.width,img.height);
						for(let i=0;matchImageData.length;i+=4){
							let alpha = matchImageData[i+3];
							if(alpha==0){
								imageData[i+3] = 0;
							}
						}
						ctx.clearRect(0,0,img.width,img.height);
						ctx.putImageData(imageData,0,0);
						const buffer = canvas.toBuffer("image/png");
						console.log("output : ",output);//," buffer : ",buffer);
						fs.writeFileSync(output,buffer);
					};
					img2.src = data;
				});
			};
			img.src = data;
		});
	}
	
	//Fix logic here to allow directory,file,directory
	
	if(fs.lstatSync(input).isDirectory() && fs.lstatSync(input2).isDirectory() && fs.lstatSync(output).isDirectory()){
		let list = fs.readdirSync(input);
		let list2 = fs.readdirSync(input2);
		let i=0;
		if(list.length!=list2.length){
			console.log("Could not comp image sequences, they are of unequal length");
			throw new Error();
		}
		for(let item of list){
			let item2 = list2[i];
			loadOut(input+'/'+item , input2+'/'+item2 , output+'/'+item);
			i++;
		}
	}
	else if(!fs.lstatSync(input).isDirectory() && !fs.lstatSync(input2).isDirectory() && !fs.lstatSync(output).isDirectory()){//is file
		loadOut(input,input2,output);
	}
	else if(!fs.lstatSync(input).isDirectory() && fs.lstatSync(input2).isDirectory() && fs.lstatSync(output).isDirectory()){
		let list = fs.readdirSync(input2);
		for(let item of list){
			loadOut(input , input2+'/'+item , output+'/'+item);
		}
	}
	else if(fs.lstatSync(input).isDirectory() && !fs.lstatSync(input2).isDirectory() && fs.lstatSync(output).isDirectory()){
		let list = fs.readdirSync(input);
		for(let item of list){
			loadOut(input+'/'+item , input2 , output+'/'+item);
		}
	}
	else{
		console.log('Error: inputs and/or output mismatch. All three are not of the same kind (either file or directory) and they are not of the types file,directory,directory.');
		throw new Error();
	}
}
else if(command=="cut"){
	console.log('Error: Unwritten code for command cut.');
	throw new Error();
}
else{
	console.log('Error: Unrecognised command '+command+'.');
	throw new Error();	
}
