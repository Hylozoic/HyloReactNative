
(find node_modules -type f -name .babelrc | grep -v /react-native/ | xargs rm) || true
patch-package