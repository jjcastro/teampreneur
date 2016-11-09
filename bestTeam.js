// clase que representa a un usuario con sus personalidades
class Usuario{
	/*
	e -> extroversion
    a -> agreeableness
    c -> conscientiousness
    n -> neuroticism
    o -> openness to experience
    keyWords -> Los keyWords que tiene el usuario
    */   
    constructor(id, e, a, c, n, o, keyWords ){
    	this.id = id;
    	this.e = e;
    	this.a = a;
    	this.c = c;
    	this.n = n;
    	this.o = o;
    	this.keyWords = keyWords;
    }

}

//Clase que representa el constructor de grupos
class TeamBuilder{
	
	/*
	lista -> matriz donde la fila i contiene el id, e, a, c, n, o en las columnas en dicho orden, y la ultima columna es una lista de keyWords
	*/
	constructor(lista, keyWordsRequeridos){
		//Valores maximo y minimo de las personalidades
		this.MAX_VALUE = 40;
		this.MIN_VALUE = 0; 
		this.keyWordsRequeridos=keyWordsRequeridos;
		this.listaUsuarios=[];
		this.allUsers=[];
		
		for (var i = 0; i<lista.length; i++) {
			var valoresUsuario = lista[i];
			var id = valoresUsuario[0];
			var e = valoresUsuario[1];
			var a = valoresUsuario[2];
			var c = valoresUsuario[3];
			var n = valoresUsuario[4];
			var o = valoresUsuario[5];
			var keyWords = valoresUsuario[6];
			var usuarioNuevo = new Usuario(id,e,a,c,n,o, keyWords);
			if(i==0){
				this.originalUser = usuarioNuevo;
			}else{
				this.listaUsuarios.push(usuarioNuevo);
				this.allUsers.push(usuarioNuevo);	
			}
		}
		this.bestTeam = this.computeBestTeam();
	}
	/*
	Método que retorna el mejor equipo calculado.
	*/
	getBestTeam(){
		return this.bestTeam;
	}
	/*
	Método que calcula el mejor equipo a partir de la lista de usuarios y sus personalidades
	*/
	computeBestTeam(){
		this.btObject=[];
		var ans =[this.originalUser.id];
		var p1a = this.originalUser.o; //promedio de O
		var p1b = 0; //varianza de O
		var p2a = this.originalUser.e; //promedio de E
		var p2b = 0; //varianza de E
		var p3 = this.originalUser.a; //promedio de A
		var p4 = this.originalUser.n; //promedio de N
		var p5a = this.originalUser.c; //promedio de C
		var p5b = 0; //varianza de C
		var n = 1; //numero de integrantes del equipo
		//console.log(this.listaUsuarios);
		for (var i = 0; i < this.listaUsuarios.length;) {
			//getNewVariance(n, oldVariance, oldMean, newMean, newValue)
			//getNewMean(n, oldMean, newValue)
			//console.log(ans);
			var bestUser = i;
			var usuarioActual = this.listaUsuarios[i];
			var bestp1a = this.getNewMean(n, p1a, usuarioActual.o);
			var bestp1b = this.getNewVariance(n, p1b, p1a, bestp1a, usuarioActual.o);
			var bestp2a = this.getNewMean(n, p2a, usuarioActual.e);
			var bestp2b = this.getNewVariance(n, p2b, p2a, bestp2a, usuarioActual.e);
			var bestp3 = this.getNewMean(n, p3, usuarioActual.a);
			var bestp4 = this.getNewMean(n, p4, usuarioActual.n);
			var bestp5a = this.getNewMean(n, p5a, usuarioActual.c);
			var bestp5b = this.getNewVariance(n, p5b, p5a, bestp5a, usuarioActual.c);
			for (var j = i+1; j < this.listaUsuarios.length; j++) {
				usuarioActual = this.listaUsuarios[j];
				var newp1a = this.getNewMean(n, p1a, usuarioActual.o);
				var newp1b = this.getNewVariance(n, p1b, p1a, newp1a, usuarioActual.o);
				var newp2a = this.getNewMean(n, p2a, usuarioActual.e);
				var newp2b = this.getNewVariance(n, p2b, p2a, newp2a, usuarioActual.e);
				var newp3 = this.getNewMean(n, p3, usuarioActual.a);
				var newp4 = this.getNewMean(n, p4, usuarioActual.n);
				var newp5a = this.getNewMean(n, p5a, usuarioActual.c);
				var newp5b = this.getNewVariance(n, p5b, p5a, newp5a, usuarioActual.c);
				//console.log(this.listaUsuarios[bestUser].id+" vs. "+usuarioActual.id+": ");
				if(this.cambiar(bestp1a,bestp1b,bestp2a,bestp2b,bestp3,bestp4,bestp5a,bestp5b,newp1a,newp1b,newp2a,newp2b,newp3,newp4,newp5a,newp5b)){
					bestp1a = newp1a;
					bestp1b = newp1b;
					bestp2a = newp2a;
					bestp2b = newp2b;
					bestp3 = newp3;
					bestp4 = newp4;
					bestp5a = newp5a;
					bestp5b = newp5b;
					bestUser = j;
				}
			}
			p1a = bestp1a;
		    p1b = bestp1b;
		    p2a = bestp2a;
		    p2b = bestp2b;
		    p3 = bestp3;
		    p4 = bestp4;
		    p5a = bestp5a;
		    p5b = bestp5b;
			ans.push(this.listaUsuarios[bestUser].id);
			this.reducirKeyWords(bestUser);
			this.listaUsuarios.splice(bestUser,1)
			n++;
			if(ans.length>=4 && this.keyWordsRequeridos.length==0){
				return ans;
			}
		}
		return ans;
	}
	/*
	Método para calcular una varianza nueva a partir de una vieja
	y un nuevo valor
	*/
	getNewVariance(n, oldVariance, oldMean, newMean, newValue){
		var oldV = oldVariance*n;
		var newV = (newValue-newMean)*(newValue-oldMean)+oldV;
		return newV/(n+1);
	}
	/*
	Método para calcular una media nueva a partir de una vieja
	y un nuevo valor
	n -> numero de elementos con los cuales se calculó el promedio viejo
	oldMean -> el promedio viejo
	newValue -> el nuevo valor a agregar al promedio
	*/
	getNewMean(n, oldMean, newValue){
		return ((oldMean*n)+newValue)/(n+1);
	}

	/*
	Método que returna true si los parametros new son mejores que best y hay que cambiarlos, false de lo contrario
	Se tiene en cuenta que:
	p1a -> promedio de O, a minimizar
	p1b -> varianza de O, a minimizar
	p2a -> promedio de E, a mantener en medios (MAX/2)
	p2b -> varianza de E, a maximizar
	p3 -> promedio de A, a maximizar
	p4 -> promedio de emotional stability (reverso de N) a mantener en niveles medios
	p5a -> promedio de C, a maximizar
	p5b -> varianza de C, a minimizar
	*/
	cambiar(bestp1a,bestp1b,bestp2a,bestp2b,bestp3,bestp4,bestp5a,bestp5b,newp1a,newp1b,newp2a,newp2b,newp3,newp4,newp5a,newp5b){
		var difp1a = bestp1a-newp1a;
		var difp1b = bestp1b-newp1b;
		var difp2a = Math.abs(bestp2a-(this.MAX_VALUE/2))-Math.abs(newp2a-(this.MAX_VALUE/2));
		var difp2b = bestp2b-newp2b;
		var difp3 = bestp3-newp3;
		var difp4 = Math.abs(bestp4-(this.MAX_VALUE/2))-Math.abs(newp4-(this.MAX_VALUE/2));
		var difp5a = bestp5a-newp5a;
		var difp5b = bestp5b-newp5b;
		var puntosNew = 0;
		if(difp1a>0) puntosNew++;
		if(difp1b>0) puntosNew++;
		if(difp2a>0) puntosNew++;
		if(difp2b<0) puntosNew++;
		if(difp3<0) puntosNew++;
		if(difp4>0) puntosNew++; 
		if(difp5a<0) puntosNew++;
		if(difp5b>0) puntosNew++;
		//console.log("Difp1a: "+difp1a+", Difp1b: "+difp1b+", Difp2a: "+difp2a+", Difp2b: "+difp2b);
		//console.log("Difp3: "+difp3+", Difp4: "+difp4+", Difp5a: "+difp5a+", Difp5b: "+difp5b);
		//console.log("Puntos new: "+puntosNew);
		return puntosNew>4;
	}

	reducirKeyWords(idUsuario){
		var usuario = this.listaUsuarios[idUsuario];
		var kwUsuario = usuario.keyWords;
		for (var i = 0; i < kwUsuario.length; i++) {
			var kw = kwUsuario[i];
			var pos = this.keyWordsRequeridos.indexOf(kw);
			if(pos>=0) this.keyWordsRequeridos.splice(pos,1);
		}
	}
	
	getUserWithId(id){
		for(var i=0; i<this.allUsers.length; i++){
			if(this.allUsers[i].id==id) return this.allUsers[i];
		}
	}
	
	getTeamStats(team){
		var p1a = this.originalUser.o; //promedio de O
		var p1b = 0; //varianza de O
		var p2a = this.originalUser.e; //promedio de E
		var p2b = 0; //varianza de E
		var p3 = this.originalUser.a; //promedio de A
		var p4 = this.originalUser.n; //promedio de N
		var p5a = this.originalUser.c; //promedio de C
		var p5b = 0; //varianza de C
		for(var i=1; i<team.length; i++){
			var usuarioActual = this.getUserWithId(team[i]);
			p1a+=usuarioActual.o;
			p2a+=usuarioActual.e;
			p3+=usuarioActual.a;
			p4+=usuarioActual.n;
			p5a+=usuarioActual.c;
		}
		p1a/=team.length;
		p2a/=team.length;
		p3/=team.length;
		p4/=team.length;
		p5a/=team.length;
		p1b = (this.originalUser.o-p1a)*(this.originalUser.o-p1a); //varianza de O
		p2b = (this.originalUser.e-p2a)*(this.originalUser.e-p2a); //varianza de E
		p5b = (this.originalUser.c-p5a)*(this.originalUser.c-p5a); //varianza de C
		for(var i=1; i<this.bestTeam.length; i++){
			
			var usuarioActual= this.getUserWithId(this.bestTeam[i]);
			p1b+=(usuarioActual.o-p1a)*(usuarioActual.o-p1a);
			p2b+=(usuarioActual.e-p2a)*(usuarioActual.e-p2a);
			p5b+=(usuarioActual.c-p5a)*(usuarioActual.c-p5a);
		}
		p1b/=team.length;
		p2b/=team.length;
		p5b/=team.length;
		console.log("Team statistics: ");
		console.log("Openness to experience (mean): "+p1a);
		console.log("Openness to experience (var): "+p1b);
		console.log("Extraversion (mean): "+p2a);
		console.log("Extraversion (var): "+p2b);
		console.log("Agreeableness (mean): "+p3);
		console.log("Neuroticism (mean): "+p4);
		console.log("Conscientiousness (mean): "+p5a);
		console.log("Conscientiousness (var): "+p5b);
	}
	
	
}

var listaPrueba = [
[1,35,25,15,10,36,["Java","HTML"]],
[2,32,29,12,19,32,["Java","Angular"]],
[3,15,35,25,15,26,["Javasript","HTML"]],
[4,34,24,11,20,33,["Java","CSS"]],
[5,15,35,35,12,33,["Finanzas","HTML"]],
[6,27,24,29,30,16,["Java","Finanzas"]]
];


var keyWordsRequeridosPrueba = ["Java", "Javasript", "Angular", "Finanzas"];
var equipo = new TeamBuilder(listaPrueba,keyWordsRequeridosPrueba);
console.log(equipo.getBestTeam());
equipo.getTeamStats(equipo.getBestTeam());
