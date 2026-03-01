import Snake from "@/components/Snake";
import Header from "@/components/Header";

export default function SnakePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <Header title="Snakidysnake" />
      <Snake />
    </main>
  );
}
