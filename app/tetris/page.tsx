import Tetris from "@/components/Tetris"
import Header from "@/components/Header";

export default function TetrisPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <Header title="Tetris!" />
      <Tetris />
    </main>
  );
}
