import { ErrorMessage, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { useMutation, useQuery } from "urql";
import InputField from "../components/InputField";
import { FieldError, useRegisterMutation } from "../src/generated/graphql";
import { toErrorMap } from "../src/helpers/toErrorMap";

interface RegisterProps {}

const query = `query Hello {
  hello 
}`;

interface Values {
  email: string;
  password: string;
}

const Register: React.FC<RegisterProps> = (props) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  return (
    <main className="">
      <div className="min-h-screen bg-rose-100 flex justify-center items-center">
        <div className="p-8">
          <div className="w-80 bg-white rounded-3xl mx-auto overflow-hidden shadow-xl">
            <div className="px-10 pt-4 pb-8 bg-white rounded-tr-3xl">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back!
              </h1>
              <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  const response = await register({ input: values });
                  if (response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors));
                    setSubmitting(false);
                  } else {
                    router.push("/");
                  }
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  isSubmitting,
                }: FormikProps<Values>) => (
                  <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="relative">
                      <InputField
                        name="email"
                        label="Email"
                        type="text"
                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600"
                        placeholder="john@doe.com"
                      />
                    </div>

                    <div className="relative mt-10">
                      <InputField
                        label="Password"
                        name="password"
                        type="password"
                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600"
                        placeholder="password"
                      />
                    </div>

                    <input
                      type="submit"
                      value={isSubmitting ? "Loading" : "Register"}
                      disabled={isSubmitting}
                      className="mt-16 px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-rose-500 focus:ring-opacity-80 cursor-pointer"
                    />
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
