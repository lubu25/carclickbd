"use client";

import {
  DeleteOutlined
} from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useFieldArray, useFormContext } from "react-hook-form";
import FormInput from "./FormInput";

const FormDynamicFields = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bid",
  });

  return (
    <>
      <div>
        {fields.length > 0 ? "" : (
          <Button type="primary" onClick={() => append(undefined)}>
            Bid Now
          </Button>)
        }
        {fields.length > 0 ? (
          fields.map((item, index) => {
            return (
              <div
                key={index}

              >
                <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
                  <Col >
                    <div>
                      <FormInput
                        name={`bid.bidPrice`}
                        label="Bid Price"
                        placeholder="Enter Your Price"
                      />
                    </div>
                  </Col>
                </Row>
                <DeleteOutlined className="text-red-500" onClick={() => remove(index)} />
              </div>
            );
          })
        ) : ""}
      </div>

    </>
  );
};

export default FormDynamicFields;
