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
                <Link href="/dash">Dashboard</Link>
            </nav>
            <hr />
        </header>
    );
}
