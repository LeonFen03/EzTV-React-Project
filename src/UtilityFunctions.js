import React from "react"
import { Link } from "react-router-dom"
const date = new Date();

// Render HTML DashBoard Objects
export function htmlRender(name,airdate,day,id ='d') {
    return (<div id={id}  draggable="true" style={{userSelect:'none'}} onDragStart={(ev) => ev.dataTransfer.setData("text", ev.target.id)} className="mediaContainer">
    <div className="flex">
        <Link to={`/TVGuide/${id}`}>{name} </Link>
        <div>

            {day ? day + ' ' : 'TBA '}
            <span className="airdates">{airdate}</span> 
        </div>
    </div>
    <div>

    </div>
    </div>)
}

// DashBoard logic for Elements sorted through Objects or Arrays.
export function renderDashboard (array,current,search='',sortedWithObject = false) {
    if (sortedWithObject === true) {
        return array.map((element)=> {
            return [<h2 >{element[0]}</h2>,element[1].map((element)=> {
            const day = element.schedule.days[0];
            let country = element.country;
                if (country === null) {
                    country = {name:'none'}
                }
            
            if (country === current && element.name.includes(search)) {

               return htmlRender(element.name,element.airdate,day,element.id);
            }
            return '';
            
            }).filter(i => i !== '')]
       }).filter(i => i[1].length > 0);
    } else {
        return array.map((element)=> {
            const day = element.schedule.days[0];
            let country = element.country;
                if (country === null) {
                    country = {name:'none'}
                }
            
            if (country === current && element.name.includes(search)) {
               return htmlRender(element.name,element.airdate,day,element.id);
            }
            
            }).filter(i => i !== '')
    }
   
    
}

//Sorting Array based on preferences defined
export function sortBy(array,type = 'By Day') {
    const sortType = {
         days: {
             Monday:[],
             Tuesday:[],
             Wednesday:[],
             Thursday:[],
             Friday:[],
             Saturday:[],
             Sunday: [],
             TBA:[]
         },
 
    }
    if (type === 'By Day') {
         array.sort((a,b) => {
             let dateA = new Date(a.airdate);
             let dateB = new Date(b.airdate);
 
             return dateA - dateB;
         })
     
         array.forEach((item)=> {
             const day = item.schedule.days[0];
             sortType.days[day ? day : 'TBA'].push(item);
         });
         return [true, Object.entries(sortType.days)];
    } else if (type === 'Recent') {
     array.sort((a,b) => {
         let dateA = new Date(a.airdate);
         let dateB = new Date(b.airdate);
 
         return dateA - dateB;
     })
 
         return [false, array];
    }
 
 }