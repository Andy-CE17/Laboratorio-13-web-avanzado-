import AccessForm from "@/components/AccessForm";

export default async function LoginPage({ searchParams }: PageProps<"/signIn">) {
  const params = await searchParams;
  return <AccessForm initialRegistration={params.modo === "registro"} />;
}
