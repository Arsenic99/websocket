import { useEffect, useState } from "react"
import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./dialog"
import { Input } from "./input"
import { Table, TableBody, TableCell, TableRow } from "./table"
import { useGetCoinByNameQuery } from "../store/queries/api"
import { useAppDispatch, useAppSelector } from "../hooks/slice"
import { setCoin, updateCoin } from "../store/slices/coinSlice"
import { toast } from 'react-toastify';

export const Header = () => {

    const notify = () => toast.error('Пожалуйста укажите количество!',{ // Уведомление об ошибке, если кол-во 0.
        closeButton: false,
        autoClose: 1000,
    });

    const coins = useAppSelector(state => state.coin.cryptoCoins);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);

    const { data } = useGetCoinByNameQuery({}); // Через RTK query загружаю все валюты
    
    useEffect(() => { // После того как данные подгрузятся записываю в стейт
        if (data !== undefined) {
            dispatch(setCoin(data))
        }
    }, [data, dispatch])

    useEffect(() => { // Подключение к websocket и запись в стейт
        const connect = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr")

        connect.onopen = () => {
            console.log("WebSocket connection opened");
        }

        connect.onmessage = (event) => {
            dispatch(updateCoin(JSON.parse(event.data)))
            setLoading(false)
        }

        connect.onerror = (error) => {
            console.log(error)
        }

        connect.onclose = () => {
            console.log("WebSocket connection closed.")
        }

        return () => {
            connect.close();
        }
    }, [dispatch])

    const [search, setSearch] = useState('');

    const defaultSymbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "BCCUSDT", "NEOUSDT"];

    const filteredCoins = search // поиск по имени
        ? coins
            .filter((el: any) =>
                el.s.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, 5)
        : coins
            .filter((el: any) =>
                defaultSymbols.includes(el.s)
            );

    const [crypt, setCrypt] = useState<any>(null)
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState<number | null>(null);

    const handleClick = (item: any) => { // принажатии записывается валюта и открывается input для введения кол-ва
        setCrypt(item)
    }
    useEffect(() => { // обнуляет стейты при открытии/закрытии диалогового окна
        if (!open) {
            setSearch('');
            setCrypt(null);
            setInput(null);
        }
    }, [open]);
    const onSubmit = () => { // сохранение валюты в локальном хранилище
        if (!input) { notify(); return;}

        const existing = JSON.parse(localStorage.getItem("coins") || "[]");

        const index = existing.findIndex((el: any) => el.s === crypt.s);

        if (index !== -1) {
            existing[index].quantity = (existing[index].quantity || 0) + input;
        } else {
            existing.push({ ...crypt, quantity: input });
        }
        localStorage.setItem("coins", JSON.stringify(existing));
        window.dispatchEvent(new Event("coinsUpdated"));

        onCancel()
    }

    const onCancel = () => { // Отклик на нажатие кнопки отмена
        setOpen(false)
    }
    return (
        <div className="flex justify-between items-center">
            <div>
                <p className="uppercase">
                    portfolio overview
                </p>
            </div>
            <div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Добавить</Button>
                    </DialogTrigger>
                    <DialogTitle className="hidden"></DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                    <DialogContent className="sm:max-w-md">
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Input
                                    placeholder="Поиск валюты"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Table>
                                    <TableBody>
                                        {
                                            loading &&
                                            <TableRow className="text-center">
                                                <TableCell>
                                                    Загрузка...
                                                </TableCell>
                                            </TableRow>

                                        }
                                        {
                                            filteredCoins && !loading && filteredCoins.map((item: any) =>
                                                <TableRow key={item.s} onClick={() => handleClick(item)}>
                                                    <TableCell>{item.s.slice(0, -4)}</TableCell>
                                                    <TableCell className="text-center">{`$${parseFloat(item.l) ? parseFloat(item.l).toFixed(5) : '0.00000'}`}</TableCell>
                                                    <TableCell className={`${parseFloat(item.P) < 0 ? 'text-red-500' : 'text-green-500'}`}>{parseFloat(item.P) >= 0 ? '+' : ''}{`${parseFloat(item.P) ? parseFloat(item.P).toFixed(2) : '+0.00'}%`}</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                                {
                                    crypt &&
                                    <div className="text-center">
                                        {
                                            crypt && <div className="flex justify-center items-center gap-5">
                                                <p>{crypt.baseAsset}</p>
                                                <p>{`$${parseFloat(crypt.l || 0).toFixed(5)}`}</p>
                                            </div>
                                        }
                                        <Input placeholder="Количество" type="number" value={input ?? ''} onChange={(e: any) => setInput(parseFloat(e.target.value) || null)} />
                                        <div className="flex justify-center gap-5 mt-5">
                                            <Button onClick={() => onSubmit()}>Добавить</Button>
                                            <Button onClick={() => onCancel()}>Отмена</Button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}