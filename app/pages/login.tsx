import { ErrorMessage, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { useMutation, useQuery } from "urql";
import InputField from "../components/InputField";
import {
  FieldError,
  useLoginMutation,
  useRegisterMutation,
} from "../src/generated/graphql";
import { toErrorMap } from "../src/helpers/toErrorMap";

interface LoginProps {}

const query = `query Hello {
  hello 
}`;

const styles = {
  container: "w-80 bg-white rounded-3xl mx-auto overflow-hidden shadow-xl",
  formContainer: "px-10 pt-4 pb-8 bg-white rounded-tr-3xl",
  inputField:
    "peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600",
  button:
    "mt-16 px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-rose-500 focus:ring-opacity-80 cursor-pointer",
  screen: "min-h-screen bg-rose-100 flex justify-center items-center",
};

const Login: React.FC<LoginProps> = (props) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <main className="">
      <div className={styles.screen}>
        <div className="p-8">
          <div className={styles.container}>
            <div className={styles.formContainer}>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back!
              </h1>
              <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  const response = await login({ input: values });
                  if (response.data?.login.errors) {
                    console.log("%%: ", response.data.login.errors);
                    setErrors(toErrorMap(response.data.login.errors));
                    setSubmitting(false);
                  } else {
                    router.push("/");
                  }
                }}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="relative">
                      <InputField
                        name="email"
                        label="Email"
                        type="text"
                        className={styles.inputField}
                        placeholder="john@doe.com"
                      />
                    </div>
                    <div className="relative mt-10">
                      <InputField
                        label="Password"
                        name="password"
                        type="password"
                        className={styles.inputField}
                        placeholder="password"
                      />
                    </div>
                    <input
                      type="submit"
                      value={isSubmitting ? "Loading" : "Login"}
                      disabled={isSubmitting}
                      className={styles.button}
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

export default Login;