import React, { useContext, useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MyContext } from "@/context/context";
import { useRouter } from "next/navigation";
import {
  deleteData,
  deleteImages,
  editData,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "@/utils/api";

// Breadcrumb Component
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddBanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formFields, setFormFields] = useState({
    images: [],
    catName: null,
    catId: null,
    subCat: null,
    subCatId: null,
    subCatName: null,
  });
  const [previews, setPreviews] = useState([]);
  const [categoryVal, setCategoryVal] = useState(null);
  const [subCatVal, setSubCatVal] = useState(null);
  const [subCatData, setSubCatData] = useState([]);

  const formdata = new FormData();
  const router = useRouter();
  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi("/api/imageUpload").then((res) => {
      res?.forEach((item) => {
        item?.images?.forEach((img) => {
          deleteImages(`/api/homeBanner/deleteImage?img=${img}`).then(() => {
            deleteData("/api/imageUpload/deleteAllImages");
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    const subCatArr = [];
    context.catData?.categoryList?.forEach((cat) => {
      if (cat?.children?.length) {
        subCatArr.push(...cat.children);
      }
    });
    setSubCatData(subCatArr);
  }, [context.catData]);

  const onChangeFile = async (e, apiEndPoint) => {
    const files = e.target.files;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      if (
        files[i] &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files[i].type
        )
      ) {
        formdata.append("images", files[i]);
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Please select a valid JPG or PNG image file.",
        });
        setUploading(false);
        return;
      }
    }

    await uploadImage(apiEndPoint, formdata);
    fetchDataFromApi("/api/imageUpload").then((response) => {
      const newPreviews = response?.flatMap((item) => item.images) || [];
      setPreviews((prev) => [...prev, ...newPreviews]);
      setUploading(false);
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Images Uploaded!",
      });
    });
  };

  const removeImg = async (index, imgUrl) => {
    await deleteImages(`/api/homeBanner/deleteImage?img=${imgUrl}`);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    context.setAlertBox({ open: true, error: false, msg: "Image Deleted!" });
  };

  const handleChangeCategory = (event) => {
    setCategoryVal(event.target.value);
    setFormFields({ ...formFields, catId: event.target.value });
  };

  const handleChangeSubCategory = (event) => {
    setSubCatVal(event.target.value);
    setFormFields({ ...formFields, subCatId: event.target.value });
  };

  const addHomeBanner = async (e) => {
    e.preventDefault();
    if (!previews.length) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please upload images.",
      });
      return;
    }

    setIsLoading(true);
    await postData("/api/banners/create", { ...formFields, images: previews });
    setIsLoading(false);
    context.fetchCategory();
    deleteData("/api/imageUpload/deleteAllImages");
    router.push("/banners");
  };

  return (
    <div className="right-content w-100">
      <form onSubmit={addHomeBanner}>
        <div className="row">
          <div className="col-md-6">
            <Select value={categoryVal} onChange={handleChangeCategory}>
              {context.catData?.categoryList?.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="col-md-6">
            <Select value={subCatVal} onChange={handleChangeSubCategory}>
              {subCatData?.map((subCat) => (
                <MenuItem key={subCat._id} value={subCat._id}>
                  {subCat.name}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="imgUploadBox">
          {previews.map((img, index) => (
            <div key={index} className="uploadBox">
              <span onClick={() => removeImg(index, img)}>
                <IoCloseSharp />
              </span>
              <LazyLoadImage src={img} effect="blur" />
            </div>
          ))}

          <input
            type="file"
            multiple
            onChange={(e) => onChangeFile(e, "/api/banners/upload")}
          />
        </div>

        <Button type="submit" className="btn-blue">
          <FaCloudUploadAlt />
          {isLoading ? <CircularProgress /> : "PUBLISH AND VIEW"}
        </Button>
      </form>
    </div>
  );
};

export default AddBanner;
