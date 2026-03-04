import Game2048 from "@/components/Game2048"
import Header from "@/components/Header";

export default function Game2048Page() {
  return (
    <main style={{ padding: "2rem" }}>
      <Header title="2048" />
      <Game2048 />
    </main>
  );
}
