import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setProductFormStep } from "@/Redux/Slices/productSlice";
import { Button, Form } from "antd";
import React from "react";

const ProductFormStep: React.FC<{ isLoading?: boolean }> = ({
  isLoading = false,
}) => {
  const currentStep = useAppSelector(
    (state) => state.productReducer.setFormStep,
  );

  const dispatch = useAppDispatch();

  const prev = () => {
    dispatch(setProductFormStep(currentStep - 1));
  };

  return (
    <div className="flex items-center gap-3  ">
      {currentStep < 1 && (
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Next
          </Button>
        </Form.Item>
      )}
      {currentStep > 0 && (
        <Form.Item>
          <Button htmlType="button" onClick={prev}>
            Previous
          </Button>
        </Form.Item>
      )}
      {currentStep === 1 && (
        <Form.Item>
          <Button loading={isLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      )}
    </div>
  );
};

export default ProductFormStep;
