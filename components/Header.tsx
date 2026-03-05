"use client";

import Link from "next/link";

type HeaderProps = {
    title: string;
};

export default function Header({ title }: HeaderProps) {
    return (
        <header style={{ marginBottom: "2rem" }}>
            <h1>{title}</h1>
            <nav>
                <Link href="/">Home</Link> |{" "}
                <Link href="/snake">Snake</Link> |{" "}
                <Link href="/tetris">Tetris</Link> |{" "}
                <Link href="/2048">2048</Link> |{" "}
                <Link href="/perler">Perler</Link> |{" "}
            </nav>
            <hr />
        </header>
    );
}
