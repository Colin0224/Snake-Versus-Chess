import {useState, useEffect } from 'react'; 

export function Test(){
    const [data, setData] = useState(null); 
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3000');
            const result = await response.json();
            setData(result); 
            console.log(result)
        }

        fetchData();
    }, []);
    return <div>{JSON.stringify(data)}</div>;
    
}