import "./vendor";
import { iosVhFix } from "./utils/ios-vh-fix";
import { initModals } from "./modals/init-modals";
import MainPresenter from "./presenter/main-presenter";

import FlowersApiServices from "./api-services/flowers-api";
import CartApiServices from './api-services/cart-api'
import FlowersModels from "./model/products-model";
import CartModels from './model/cart-models'
import FilterModel from './model/filter-reason-model';

const AUTHORIZATION = 'Basic hS2sfS44wcW2Sa2w';
const END_POINT = 'https://grading.objects.htmlacademy.pro/flowers-shop/';


window.addEventListener("DOMContentLoaded", () => {
  iosVhFix();

  window.addEventListener("load", () => {
    initModals();
  });

  const body = document.querySelector("body");
  const headerContainerCount = body.querySelector(".header__container");
  const wrapper = body.querySelector(".wrapper");
  const mainContainer = body.querySelector("main");

  const flowersProducts = new FlowersModels(new FlowersApiServices(END_POINT, AUTHORIZATION));
  const cartModel = new CartModels(new CartApiServices(END_POINT, AUTHORIZATION));

  const filterModel = new FilterModel();

  const mainPresenter = new MainPresenter(
    mainContainer,
    headerContainerCount,
    wrapper,
    flowersProducts,
    filterModel,
    cartModel);

  mainPresenter.init();
});
