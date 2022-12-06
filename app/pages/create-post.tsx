import { Formik } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import * as React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation, useMeQuery } from "../src/generated/graphql";
import { toErrorMap } from "../src/helpers/toErrorMap";
import { createUrqlClient } from "../src/utils/createUrqlClient";
import { useIsAuth } from "../src/utils/isAuth";

interface createPostProps {}
const CreatePost: React.FC<createPostProps> = (props) => {
  const [, createPost] = useCreatePostMutation();
  useIsAuth();
  return (
    <Layout displayName="Create Post">
      <div className={`${styles.container} w-96 mt-4`}>
        <div className={styles.formContainer}>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create a post
          </h1>
          <Formik
            initialValues={{ title: "", text: "" }}
            onSubmit={async (values, {}) => {
              const response = await createPost({
                input: values,
              });
              console.log("***: ", response);
              if (response.error?.message.includes("not authenticated"))
                router.replace("/login");
              router.push("/");
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <form className="mt-6" onSubmit={handleSubmit}>
                <div className="relative">
                  <InputField
                    name="title"
                    label="Title"
                    type="text"
                    className={styles.inputField}
                    placeholder="john@doe.com"
                  />
                </div>
                <div className="relative mt-10">
                  <InputField
                    name="text"
                    label="Text"
                    rows={5}
                    isInput={false}
                    placeholder="write a post..."
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <input
                  type="submit"
                  value={isSubmitting ? "Loading" : "Create"}
                  disabled={isSubmitting}
                  className={styles.button}
                />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: "bg-white mx-auto overflow-hidden",
  formContainer: "px-10 pt-4 pb-8 bg-white rounded-tr-3xl",
  inputField:
    "peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600",
  button:
    "mt-16 px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-rose-500 focus:ring-opacity-80 cursor-pointer",
  screen: "min-h-screen bg-rose-100 flex justify-center items-center",
};

export default withUrqlClient(createUrqlClient)(CreatePost);
function setErrors(arg0: any) {
  throw new Error("Function not implemented.");
}
