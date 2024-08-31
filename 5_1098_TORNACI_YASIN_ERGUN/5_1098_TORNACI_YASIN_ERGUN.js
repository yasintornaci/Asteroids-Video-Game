const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

W= canvas.width;
H=canvas.height;
let VectorBile = [];
const animateCounter = 0;
let BileCounter=0;

class Circle {
    constructor(x, y, dx, dy,number, raza, color) { 
      //x,y   - pozitia cercului
      //dx,dy - sensul in care se deplaseaza cercul
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.number=number;
      this.raza = raza;
      this.color = color;
    }
    drawCircle = function()
    {
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.raza,0,Math.PI* 2,false);
      ctx.fillStyle = this.color;
      ctx.stroke();
      ctx.fill();
      ctx.closePath();

      ctx.font='25px Calibri';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(this.number,this.x,this.y+6);
    };
    updateCircle = function () {
      if (this.x + this.raza > W || this.x - this.raza < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.raza > H || this.y - this.raza < 0) {
        this.dy = -this.dy;
      }
      this.x += this.dx;
      this.y += this.dy;
      this.drawCircle();
    };
  }

  class Triangle
  {
    constructor(ax,ay,bx,by,cx,cy)
    {
      this.ax=ax;
      this.ay = ay;
      this.bx=bx;
      this.by = by;
      this.cx=cx;
      this.cy = cy;
    }
    drawTriangle =function()
    {
        ctx.beginPath();
        ctx.moveTo(this.ax,this.ay);
        ctx.lineTo(this.bx,this.by);
        ctx.lineTo(this.cx,this.cy);
        ctx.lineTo(this.ax,this.ay);
        ctx.fillStyle="red";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.font = '25px Calibri';
        ctx.fillStyle='black';
        ctx.textAlign='center';
        ctx.fillText(".",this.ax,this.ay+10);
    }
    updateTriangle = function(){
      this.drawTriangle();
      }
  };

  class Racheta
  {
    constructor(x,y,vx,vy) // x,y - pozitie ; vx,vy - viteza de deplasare
    {
      this.x = x;
      this.y=y;
      this.vx = vx;
      this.vy = vy;
      this.raza = 5;
    }
    drawRacheta()
    {
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.raza,0,Math.PI*2);
      ctx.closePath();
      ctx.fillStyle = 'blue';
      ctx.fill();

    }
    updateRacheta()
    {
     this.drawRacheta();
     this.x += this.vx;
     this.y +=this.vy;
    }
  }


  class Vieti
  {
    constructor(puncteVieti)
    {
      this.puncteVieti = puncteVieti;
    }
    drawVieti()
    {
      ctx.beginPath();
      ctx.font="60px Calibri";
      ctx.fillStyle='white';
      ctx.fillText(Math.floor(this.puncteVieti/3),750,750);
      ctx.closePath();

    }
    updateVieti()
    {
      this.drawVieti();
    }
  }

  const VectorRachete= [];

  const vieti = new Vieti(6);
  const triunghi = new Triangle(400,500,430,550,370,550);


  function coliziuneCC(cerc1,cerc2)
  {
    //verificam daca distanta dintre pozitiile cercurilor este mai mica
    //decat razele lor adunate;
    //avand in vedere ca folosim contextul in 2d, folosim teorema
    //lui Pitagora
    let difX = cerc2.x - cerc1.x; 
    //masuram distanta de la un cerc la 
    //celalalt pe axa OX
    let difY = cerc2.y - cerc1.y;
    //masuram distanta de la un cerc la 
    //celalalt pe axa OY
    
    let distanta = Math.sqrt(difX * difX + difY * difY);

    if(distanta <= cerc1.raza + cerc2.raza)
      return true;
    else
      return false;
  }

  function coliziuneCT(tri,cerc)
  {
    //verificam daca punctul A se afla in interiorul cercului
    //adica distanta dintre punct si centrul cercului trebuie sa fie 
    //mai mica decat raza(asemenea pentru toate punctele)

    //A
    let dif1X = cerc.x - tri.ax; 
    let dif1Y = cerc.y - tri.ay;
    let distanta1 = Math.sqrt(dif1X * dif1X + dif1Y * dif1Y);
    if(distanta1 <= cerc.raza)
      return true;
    //B
    let dif2X = cerc.x - tri.bx; 
    let dif2Y = cerc.y - tri.by;
    let distanta2 = Math.sqrt(dif2X * dif2X + dif2Y * dif2Y);
    if(distanta2 <= cerc.raza)
      return true;
    //C
    let dif3X = cerc.x - tri.cx; 
    let dif3Y = cerc.y - tri.cy;
    let distanta3 = Math.sqrt(dif3X * dif3X + dif3Y * dif3Y);
    if(distanta3 <= cerc.raza)
      return true;
  }

  //vrem sa tinem evidenta coliziunilor dintre triunghi si bila,
  //deoarece daca cele 2 se ciocnesc, vietile nu scad doar cu unu, ci cu
  //numarul de animatii in care cele 2 s-au mentinut in coliziune
  let coliziuneCTevi = 0;


  function showPopup1() {
    document.getElementById("popup1").style.display = "block";
  }

  function hidePopup1() {
    location.reload();
  }

  function showPopup2() {
    document.getElementById("popup2").style.display = "block";
  }

  function hidePopup2() {
    location.reload();
  }

  

  document.getElementById("btn1").addEventListener("click", () => 
  {
    VectorBile=[];
    ctx.clearRect(0,0,W,H);//pentru a curata canvas-ul deoarece 
    //daca am apasa de mai multe ori pe buton s-ar desena 
    //mai multe bile decat dorim

    let circleArray = [];
    for(i=0;i<5;i++)
    {
      let x= Math.random() *W;
      let y = Math.random() *H;
      if(x<1) x=1;
      if(y<1) y=1;
      if(y>200) y=200;//pentru a seta limita bilelor la jumatatea canvasului, separand bilele de nava
      let dx = (Math.random() - 0.5) * 1.5;
      let dy = (Math.random() - 0.5) * 1.5;
      let number =Math.round(Math.random() * 3) +1;
      let raza = 10*(number+1);
      let color = `rgba(${Math.random() * 255}, ${Math.random() * 255},
       ${Math.random() * 255}, ${Math.random() * 255})`;
      circleArray.push(new Circle(x, y,dx,dy,number, raza, color));
      circleArray[i].drawCircle();
    }

    for(i=0;i<5;i++)
    {
      VectorBile[i] = circleArray[i];
    }

    
    triunghi.drawTriangle();

  });
  document.getElementById("btn2").addEventListener("click", () => 
  {
    VectorBile=[];
    ctx.clearRect(0,0,W,H);

    let circleArray = [];
    for(i=0;i<6;i++)
    {
      let x= Math.random() *W;
      let y = Math.random() *H;
      if(x<1) x=1;
      if(y<1) y=1;
      if(y>200) y=200;
      let dx = (Math.random() - 0.5) * 3;
      let dy = (Math.random() - 0.5) * 3;
      let number =Math.round(Math.random() * 3) +1;
      let raza = 10*(number+1);
      let color = `rgba(${Math.random() * 255}, ${Math.random() * 255},
       ${Math.random() * 255}, ${Math.random() * 255})`;
      circleArray.push(new Circle(x, y,dx,dy,number, raza, color));
      circleArray[i].drawCircle();
    }
    

    for(i=0;i<6;i++)
    {
      VectorBile[i] = circleArray[i];
    }
    triunghi.drawTriangle();
  });
  document.getElementById("btn3").addEventListener("click", () => 
  {
    
    VectorBile=[];
    ctx.clearRect(0,0,W,H);

    let circleArray = [];
    for(i=0;i<7;i++)
    {
      let x= Math.random() *W;
      let y = Math.random() *H;
      if(x<1) x=1;
      if(y<1) y=1;
      if(y>200) y=200;
      let dx = (Math.random() - 0.5) * 8;
      let dy = (Math.random() - 0.5) * 8;
      let number =Math.round(Math.random() * 3) +1;
      let raza = 10*(number+1);
      let color = `rgba(${Math.random() * 255}, ${Math.random() * 255},
       ${Math.random() * 255}, ${Math.random() * 255})`;
      circleArray.push(new Circle(x, y,dx,dy,number, raza, color));
      circleArray[i].drawCircle();
    }
    for(i=0;i<7;i++)
    {
      VectorBile[i] = circleArray[i];
    }
    triunghi.drawTriangle();
  });



  document.getElementById("start").addEventListener("click", () => 
  {

    function stop()
    {
     cancelAnimationFrame(anim);
    }
    function animate() 
    {
        ctx.clearRect(0, 0, W, H);
        vieti.updateVieti();


        for(i = VectorRachete.length-1;i>=0;i--)
        {
          const racheta = VectorRachete[i];
          racheta.updateRacheta();

        }
        triunghi.updateTriangle();

        for (i = VectorBile.length-1; i >=0; i--) {
          const bila1 = VectorBile[i];
          bila1.updateCircle();

          if(coliziuneCT(triunghi,bila1) && coliziuneCTevi===0)
          {
            vieti.puncteVieti-=3;
            coliziuneCTevi =1;
            setTimeout(() => {coliziuneCTevi=0},600);
          }

          for(j = VectorRachete.length-1;j>=0;j--)
          {
            const racheta =VectorRachete[j];
            if(coliziuneCC(bila1,racheta) && bila1.number ===1)
            {
              //eliminam de pe ecran bila cu valoarea 1, pe restul le scadem 
              //in dimensiune pana au si ele valoarea 1 pentru a le elimina
              VectorBile.splice(i,1);
              VectorRachete.splice(j,1);
              vieti.puncteVieti+=1;
            }
            else if(coliziuneCC(bila1,racheta) && bila1.number !=1)
            {
              bila1.number-=1;
              bila1.raza/=1.3;
              VectorRachete.splice(j,1); //stergem racheta din vector pentru
              //ca racheta nu trecea doar o data prin bila, si astfel cu o racheta
              //scadeam valoarea unei bile de la 3 la 0 instant.
              vieti.puncteVieti+=1;
            }
          
          }
          
          for(k=VectorBile.length-1;k>=0;k--)
          {
            const bila2 = VectorBile[k];

            if(coliziuneCC(bila1,bila2))
            {
              bila1.dx *=-1;
              bila1.dy *=-1;
              bila2.dx *=-1;
              bila2.dy *=-1;

              bila1.x+=bila1.dx;
              bila1.y+=bila1.dy;
              bila2.x+=bila2.dx;
              bila2.y+=bila2.dy;
            }

          }
          
          
          if(Math.floor(vieti.puncteVieti/3)===0)
          {
            showPopup2();

          }
          if(VectorBile.length===0)
          {
            showPopup1();
          }
        }

        

        anim=requestAnimationFrame(animate);
    }



      

     document.addEventListener('keydown',function(miscare)
    {
      const dif = 15;

      switch(miscare.key)
      {
        case 'ArrowLeft':
          triunghi.ax-=dif;
          triunghi.bx-=dif;
          triunghi.cx-=dif;
          break;
        case 'ArrowRight':
          triunghi.ax+=dif;
          triunghi.bx+=dif;
          triunghi.cx+=dif;
          break; 
        case 'ArrowUp':
          triunghi.ay-=dif;
          triunghi.by-=dif;
          triunghi.cy-=dif;
          break;
        case 'ArrowDown':
          triunghi.ay+=dif;
          triunghi.by+=dif;
          triunghi.cy+=dif;
          break; 
        case 'z':
          if(triunghi.ay!=(triunghi.by+triunghi.cy)/2 && triunghi.ax<triunghi.bx)
          {
            //cazul in care triunghiul este orientat in sus
            triunghi.cx=triunghi.bx;
            triunghi.cy=triunghi.by;
            triunghi.by-=60;
            triunghi.ax=triunghi.bx-50;
            triunghi.ay=(triunghi.by+triunghi.cy)/2;
            break;
          }
          else if(triunghi.ay===(triunghi.by+triunghi.cy)/2 && triunghi.ax>triunghi.bx)
          {
            //cazul cand triunghiul este orientat in dreapta,si il
            //orientam din nou in sus 
            triunghi.cx=triunghi.bx;
            triunghi.cy=triunghi.by;
            triunghi.bx+=60;
            triunghi.ay=triunghi.cy-50;
            triunghi.ax=(triunghi.bx+triunghi.cx)/2;
            break;
          }
          else
          break;


        case 'c':
          if(triunghi.ay!=(triunghi.by+triunghi.cy)/2 && triunghi.ax<triunghi.bx)
          {
            //cazul in care triunghiul este orientat in sus
            triunghi.bx=triunghi.cx;
            triunghi.by=triunghi.cy;
            triunghi.cy-=60;
            triunghi.ax=triunghi.cx+50;
            triunghi.ay=(triunghi.by+triunghi.cy)/2;
            break;
         }
         else if(triunghi.ay===(triunghi.by+triunghi.cy)/2 && triunghi.ax<triunghi.bx)
         {
            //cazul cand triunghiul este orientat in stanga,si il
            //orientam din nou in sus 
            triunghi.bx=triunghi.cx;
            triunghi.by=triunghi.cy;
            triunghi.cx-=60;
            triunghi.ay=triunghi.cy-50;
            triunghi.ax=(triunghi.bx+triunghi.cx)/2;
            break;
         }
         else
         break;


        case 'x':
          {
            if(triunghi.ay!=(triunghi.by+triunghi.cy)/2 && triunghi.ax<triunghi.bx)
            {
            //cazul in care triunghiul este orientat in sus
              VectorRachete.push(new Racheta(triunghi.ax,triunghi.ay,0,-4));
              //vrem sa lansam racheta in sus
            }

            else if(triunghi.ay===(triunghi.by+triunghi.cy)/2 && triunghi.ax<triunghi.bx)
            {
              //cazul cand triunghiul este orientat in stanga
              VectorRachete.push(new Racheta(triunghi.ax,triunghi.ay,-4,0));
              //vrem sa lansam racheta in stanga
            }

            else if(triunghi.ay===(triunghi.by+triunghi.cy)/2 && triunghi.ax>triunghi.bx)
            {
              //cazul cand triunghiul este orientat in dreapta
              VectorRachete.push(new Racheta(triunghi.ax,triunghi.ay,4,0));
              //vrem sa lansam racheta in dreapta
            }
          } 


      }

     });

     animate();
  });


  
  
  

