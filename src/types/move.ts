export type Move = {
    from: string;
    to: string;
    figure: string;
    capture: string;
    promotion: string;
    castling: "O-O" | "O-O-O" |  null;
    isCheck: boolean;
    isCheckmate: boolean;
}
