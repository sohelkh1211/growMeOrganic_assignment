import { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { OverlayPanel } from "primereact/overlaypanel";
import toast from "react-hot-toast";

const ArtworkTable = () => {
    interface RequiredData {
        id: number,
        title: string;
        place_of_origin: string;
        artist_display: string;
        inscriptions: string | null;
        date_start: number;
        date_end: number;
    }

    const [artworkData, setArtworkData] = useState<RequiredData[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<RequiredData[]>([]);
    const [prevPage, setPrevPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(12);

    // Show Loading... when there is delay in fetching some data
    const [loading, setLoading] = useState<boolean>(true);

    const op = useRef<any>(null); // For Overlay Panel

    const [selectedRows, setSelectedRows] = useState<number>(0);
    const [row, setRow] = useState<number>();

    const fetchData = async (page: number) => {
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page + 1}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            const art_data = data.data;

            if (response.ok) {
                setArtworkData(art_data.map((item: any) => ({
                    id: item.id || 0,
                    title: item.title || '',
                    place_of_origin: item.place_of_origin || '',
                    artist_display: item.artist_display || '',
                    inscriptions: item.inscriptions || null,
                    date_start: item.date_start || 0,
                    date_end: item.date_end || 0
                })));
            } else {
                console.log("Error :- ", data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);

    }, [currentPage]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setCurrentPage(prev => {
            setPrevPage(prev);
            return e.first / 12;
        });

        setLoading(true);
        setFirst(e.first);
        setRows(e.rows);


    };

    const onSubmit = async () => {
        let temp = selectedRows;
        if (!selectedRows) {
            toast.error("Enter valid number of rows");
            op.current.toggle(false);
            return;
        }
        if (selectedRows > 30) {
            toast.error("Max 30 rows are allowed");
            op.current.toggle(false);
            return;
        }

        console.log(row);

        if (temp !== undefined && temp > 12) {
            setSelectedProducts(artworkData);
            setRow(temp - 12);
        } else {
            let topArtworks: RequiredData[] = artworkData.slice(0, temp);

            let updatedSelectedProducts: RequiredData[] = topArtworks.concat(selectedProducts);

            // To remove duplicates
            let uniqueProducts: RequiredData[] = updatedSelectedProducts.reduce((acc, item) => {
                if (!acc.some(product => product.id === item.id)) {
                    acc.push(item);
                }
                return acc;
            }, [] as RequiredData[]);

            setRow(parseInt(''));
            setSelectedProducts(uniqueProducts);
        }

        op.current.toggle(false);
    }

    if (!loading) {
        console.log("selected rows: ", selectedRows, row);
        console.log("Prev page: ", prevPage, "Current Page: ", currentPage);
        console.log("Artwork: ", artworkData);
    }

    if (!loading && row !== undefined && row > 0 && currentPage-prevPage === 1) {
        if (row <= artworkData.length) {
            let new_data: RequiredData[] = selectedProducts.concat(artworkData.slice(0, row));
            setSelectedProducts(new_data);
            setRow(parseInt(''));
        }
    }



    return (
        <div className="flex flex-col gap-y-6 mb-10 mt-2 w-fit mx-auto">
            {loading ?
                <div className="flex w-fit mx-auto">
                    <p className="text-[28px]">Loading....</p>
                </div> :
                <DataTable
                    value={artworkData}
                    rows={12}
                    showGridlines={true}
                    selectionMode='checkbox'
                    selection={selectedProducts}
                    onSelectionChange={(e: any) => setSelectedProducts(e.value)}
                    dataKey="id"
                    tableStyle={{ width: '60rem' }}
                    
                >
                    <Column selectionMode="multiple" header={<div className="flex "><i className="pi pi-chevron-down cursor-pointer" style={{ marginLeft: 'auto' }} onClick={(e) => op.current.toggle(e)}></i><span style={{ marginRight: '10px' }}></span></div>} headerStyle={{ textAlign: 'center', padding: '0.5rem' }} bodyStyle={{ textAlign: 'center', padding: '0.5rem' }}></Column>

                    <Column field="title" header="Title" headerStyle={{ textAlign: 'center', padding: '0.5rem 4rem', whiteSpace: 'nowrap' }} bodyStyle={{ textAlign: 'center', padding: '0.5rem' }} ></Column>
                    <Column field="place_of_origin" header="Place of origin" headerStyle={{ textAlign: 'center', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }} bodyStyle={{ textAlign: 'center', padding: '0.5rem' }} ></Column>
                    <Column field="artist_display" header="Artist display" headerStyle={{ textAlign: 'center', padding: '0.5rem 4rem', whiteSpace: 'nowrap' }} bodyStyle={{ textAlign: 'center', padding: '0.5rem' }} ></Column>
                    <Column field="inscriptions" header="Inscriptions" headerStyle={{ textAlign: 'center', padding: '0.5rem 4rem', whiteSpace: 'nowrap' }} bodyStyle={{ textAlign: 'center', padding: '0.5rem' }}></Column>
                    <Column field="date_start" header="Date Start" headerStyle={{ textAlign: 'center', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }} bodyStyle={{ textAlign: 'center', padding: '0.5rem' }} ></Column>
                    <Column field="date_end" header="Date End" headerStyle={{ textAlign: 'center', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }} bodyStyle={{ textAlign: 'center', padding: '0.5rem' }} ></Column>

                </DataTable>
            }
            <OverlayPanel ref={op}>
                <div className="flex flex-col gap-3 p-3">
                    <input type="number" placeholder="Select rows" min={1} max={30} value={selectedRows} onChange={(e) => setSelectedRows(parseInt(e.target.value))} className="outline-none min-w-10 px-2 py-1 border border-black rounded-md" />
                    <button className="flex w-fit mx-auto bg-cyan-500 text-white px-3 py-1 border rounded-lg" onClick={onSubmit}>Submit</button>
                </div>
            </OverlayPanel>
            <Paginator first={first} rows={rows} totalRecords={120} onPageChange={onPageChange} className={`${loading ? 'hidden' : 'flex'}`} />
        </div>


    );
}

export default ArtworkTable;