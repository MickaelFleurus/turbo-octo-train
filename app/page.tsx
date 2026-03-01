import Header from "@/components/Header";
import StyledButton from "@/components/StyledButton"


export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <Header title="Hello! This is a test page." />
      <p>Welcome to this test app. I am testing things.</p>
      <StyledButton variant="danger" size="medium">
        Click me
      </StyledButton>
    </main>
  );
}
