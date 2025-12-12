import { Button } from '@/components/ui/button';
import {Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
function List() {
    const [listsData, setListsData] = useState([]);
    const allLists = ()=>{
          fetch('http://localhost:3000/lists/69397295490f817493bca691')
            .then(response => response.json())
            .then(listsUser => {
                setListsData(listsUser);
            });
    }
    useEffect(() => {
        allLists()
    }, []);

    const list = listsData?.listsUser?.map((listUser) => {
        console.log("listUser", listUser);

        return (
            <div className='w-full bg-lightblue rounded-lg mt-10' key={listUser._id}>
                <h6 className='p-10 bg-orange w-[10%]'>{listUser.name}</h6>

                <div className='flex flex-wrap items-center'>
                    {listUser.products.map((product)=>{
                        return(
                            <ProductCard  
                            name={product.name} 
                            id={product._id}
                            picture={product.picture} 
                            desc={product.desc}
                            priceMoy={product.priceMoy}
                            stars={product.stars}
                            listNames={listsData.listsUser}
                            />
                        )
                    })}
                </div>
            </div>
        );
    });

    return (
        <>
            {/* {list} */}
            <main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body">
                <section className='w-full h-full p-20'>
                    <div>
                        <h3 className='text-4xl'>Favoris</h3>
                        <Button className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm mt-10"><Plus /></Button>
                    </div>
                    {list}
                </section>
            </main>
        </>
    );
}

export default List;
