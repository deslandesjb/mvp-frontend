import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import Link from 'next/link';
import Image from 'next/image';
import {useEffect, useState} from 'react';
function List() {

    useEffect(() => {
        fetch('http://locahost:3000/lists/69393f8a74b0907d64033c06')
        .then(response=>response.json())
        .then(listsUSer=>{
            console.log(listsUSer)
        })
    }, []);









    return (
        <>
            <main className="flex h-screen-header min-h-96 flex-col items-center justify-center font-body">
                <section className='w-full h-full p-20'>
                    <div>
                        <h3 className='text-4xl'>Favoris</h3>
                        <Button className="bg-orange text-zinc-900 shadow-lg hover:bg-orangehover hover:shadow-sm mt-10"><Plus /></Button>
                    </div>
                    <div className='w-full    bg-lightblue rounded-lg mt-10'>
                        <h6 className='p-10 bg-orange w-[10%]'>Title of list</h6>
                        <div className=' flex flex-wrap'>
                            <Card className="w-[20%] min-w-60 overflow-hidden hover:shadow-lg m-10">
                                <Link href={"#"} className="inline-block h-full flex justify-around items-center">
                                    <Image src={"https://static.fnac-static.com/multimedia/Images/FR/MDM/7b/7f/f0/15761275/1540-1/tsp20251205131610/Casque-sans-fil-Bluetooth-Marshall-Major-IV-Noir.jpg"} alt={"data.picture[0].title"} width={200} height={200}  />
                                    <div className=''>
                                        <CardHeader>
                                            <CardTitle>Casque</CardTitle>
                                            <CardDescription>Beau Casque</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex">*****</div>
                                            <div className="flex justify-between">
                                                <p className="font-bold">785€</p>
                                                {/* <p>{data.noteMoy}</p> */}
                                            </div>
                                            {/* <div className="mt-auto flex justify-between">
							<p>{data.brand}</p>
							<p>{data.categorie}</p>
						</div> */}
                                        </CardContent>
                                    </div>
                                </Link>
                            </Card><Card className="w-[20%] min-w-60 overflow-hidden hover:shadow-lg m-10">
                                <Link href={"#"} className="inline-block h-full flex justify-around items-center">
                                    <Image src={"https://static.fnac-static.com/multimedia/Images/FR/MDM/7b/7f/f0/15761275/1540-1/tsp20251205131610/Casque-sans-fil-Bluetooth-Marshall-Major-IV-Noir.jpg"} alt={"data.picture[0].title"} width={200} height={200}  />
                                    <div className=''>
                                        <CardHeader>
                                            <CardTitle>Casque</CardTitle>
                                            <CardDescription>Beau Casque</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex">*****</div>
                                            <div className="flex justify-between">
                                                <p className="font-bold">785€</p>
                                                {/* <p>{data.noteMoy}</p> */}
                                            </div>
                                            {/* <div className="mt-auto flex justify-between">
							<p>{data.brand}</p>
							<p>{data.categorie}</p>
						</div> */}
                                        </CardContent>
                                    </div>
                                </Link>
                            </Card><Card className="w-[20%] min-w-60 overflow-hidden hover:shadow-lg m-10">
                                <Link href={"#"} className="inline-block h-full flex justify-around items-center">
                                    <Image src={"https://static.fnac-static.com/multimedia/Images/FR/MDM/7b/7f/f0/15761275/1540-1/tsp20251205131610/Casque-sans-fil-Bluetooth-Marshall-Major-IV-Noir.jpg"} alt={"data.picture[0].title"} width={200} height={200}  />
                                    <div className=''>
                                        <CardHeader>
                                            <CardTitle>Casque</CardTitle>
                                            <CardDescription>Beau Casque</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex">*****</div>
                                            <div className="flex justify-between">
                                                <p className="font-bold">785€</p>
                                                {/* <p>{data.noteMoy}</p> */}
                                            </div>
                                            {/* <div className="mt-auto flex justify-between">
							<p>{data.brand}</p>
							<p>{data.categorie}</p>
						</div> */}
                                        </CardContent>
                                    </div>
                                </Link>
                            </Card><Card className="w-[20%] min-w-60 overflow-hidden hover:shadow-lg m-10">
                                <Link href={"#"} className="inline-block h-full flex justify-around items-center">
                                    <Image src={"https://static.fnac-static.com/multimedia/Images/FR/MDM/7b/7f/f0/15761275/1540-1/tsp20251205131610/Casque-sans-fil-Bluetooth-Marshall-Major-IV-Noir.jpg"} alt={"data.picture[0].title"} width={200} height={200}  />
                                    <div className=''>
                                        <CardHeader>
                                            <CardTitle>Casque</CardTitle>
                                            <CardDescription>Beau Casque</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex">*****</div>
                                            <div className="flex justify-between">
                                                <p className="font-bold">785€</p>
                                                {/* <p>{data.noteMoy}</p> */}
                                            </div>
                                            {/* <div className="mt-auto flex justify-between">
							<p>{data.brand}</p>
							<p>{data.categorie}</p>
						</div> */}
                                        </CardContent>
                                    </div>
                                </Link>
                            </Card><Card className="w-[20%] min-w-60 overflow-hidden hover:shadow-lg m-10">
                                <Link href={"#"} className="inline-block h-full flex justify-around items-center">
                                    <Image src={"https://static.fnac-static.com/multimedia/Images/FR/MDM/7b/7f/f0/15761275/1540-1/tsp20251205131610/Casque-sans-fil-Bluetooth-Marshall-Major-IV-Noir.jpg"} alt={"data.picture[0].title"} width={200} height={200}  />
                                    <div className=''>
                                        <CardHeader>
                                            <CardTitle>Casque</CardTitle>
                                            <CardDescription>Beau Casque</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex">*****</div>
                                            <div className="flex justify-between">
                                                <p className="font-bold">785€</p>
                                                {/* <p>{data.noteMoy}</p> */}
                                            </div>
                                            {/* <div className="mt-auto flex justify-between">
							<p>{data.brand}</p>
							<p>{data.categorie}</p>
						</div> */}
                                        </CardContent>
                                    </div>
                                </Link>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default List;
