import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../src/components/ui/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: { autodocs: "tag" },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: require.resolve("babel-loader"),
        options: {
          presets: [
            require.resolve("@babel/preset-env"),
            require.resolve("@babel/preset-react"),
            require.resolve("@babel/preset-typescript"),
          ],
        },
      },
    });
    webpackConfig.resolve.extensions = [...(webpackConfig.resolve.extensions || []), ".js", ".jsx", ".ts", ".tsx"];
    return webpackConfig;
  },
};

export default config;
