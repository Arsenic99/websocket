import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../table";

export const CoinTable = () => {
    const [coins, setCoins] = useState<any[]>([]);
    const [sum, setSum] = useState(10)

    const loadCoins = () => { // загружает валюты из локального хранилища
        const stored = localStorage.getItem("coins");
        if (stored) {
            setCoins(JSON.parse(stored));
            setSum(JSON.parse(stored).reduce((acc: any, curr: any) => acc + parseFloat(curr.l || 0) * parseFloat(curr.quantity), 0))
        } else {
            setCoins([]);
        }
    };
    useEffect(() => {
        loadCoins();

        const handleStorageChange = () => loadCoins();
        window.addEventListener("coinsUpdated", handleStorageChange); // при добавлении валюты в диалоговогом окне, перерисовывает таблицу

        return () => {
            window.removeEventListener("coinsUpdated", handleStorageChange);
        };
    }, []);

    const handleClick = (item: any) => { //удаление валюты из локального хранилища
        const updatedCoins = coins.filter((el) => el.symbol !== item.symbol);
        localStorage.setItem("coins", JSON.stringify(updatedCoins));
        setCoins(updatedCoins);

        window.dispatchEvent(new Event("coinsUpdated"));
    };

    return (
        <Table className="mt-10">
            {
                coins.length !== 0 ? < TableBody >
                    <TableRow>
                        <TableHead className="text-center">Актив</TableHead>
                        <TableHead className="text-center">Количество</TableHead>
                        <TableHead className="text-center">Цена</TableHead>
                        <TableHead className="text-center">Общая стоимость</TableHead>
                        <TableHead className="text-center">Изм. за 24 ч.</TableHead>
                        <TableHead className="text-center">% портфеля</TableHead>
                    </TableRow>
                    {
                        coins.map((item: any) => (
                            <TableRow key={item.s} className="cursor-pointer hover:bg-gray-200" onClick={() => handleClick(item)}>
                                <TableCell className="text-center">{item.s.slice(0, -4)}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{`$${parseFloat(item.l || 0).toFixed(5)}`}</TableCell>
                                <TableCell className="text-center">{`$${(parseFloat(item.l || 0) * item.quantity).toFixed(2)}`}</TableCell>
                                <TableCell className={`${parseFloat(item.P) < 0 ? 'text-red-500' : 'text-green-500'} text-center`}>
                                    {parseFloat(item.P) >= 0 ? '+' : ''}
                                    {`${parseFloat(item.P) ? parseFloat(item.P).toFixed(2) : '+0.00'}%`}
                                </TableCell>
                                <TableCell className="text-center">{`${(parseFloat(item.l || 0) * item.quantity / sum * 100).toFixed(2)}%`}</TableCell>
                            </TableRow>
                        ))
                    }
                </ TableBody> :
                    <TableBody className="w-full">
                        <TableRow className="w-full">
                            <TableCell className="w-full text-center font-bold text-lg">
                            Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!
                            </TableCell>
                        </TableRow>
                    </TableBody>
            }
        </Table >
    );
};
