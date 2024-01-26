import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { FormInput } from "components/FormGroup";
import {
  PricingType,
  ProductionSimulatorType,
} from "./ProductionSimulatorTable";

export interface AddFixedExpensesProps {
  open: boolean;
  onClose: () => void;
  pricings: PricingType[];
  onProductionSimulatorUpdate: (
    newProductionSimulator: ProductionSimulatorType
  ) => void;
}

const validationSchema = Yup.object().shape({
  productionQuantity: Yup.number()
    .typeError("Deve ser um número")
    .required("Campo obrigatório")
    .positive("Deve ser um valor positivo"),
  pricingId: Yup.string()
    .required("Campo obrigatório")
    .test("is-valid-id", "Seleção inválida", (value) => {
      return value !== "";
    }),
});

const ModalAddProductionSimulator: React.FC<AddFixedExpensesProps> = ({
  open,
  onClose,
  pricings,
  onProductionSimulatorUpdate,
}) => {
  const initialValues = {
    productionQuantity: 0,
    pricingId: "",
  };

  const handleSubmit = (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    console.log(values);
    onProductionSimulatorUpdate(values);
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Criar simulação</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, values }) => (
            <Form>
              <FormControl fullWidth>
                <FormInput
                  name="productionQuantity"
                  label="Quantidade de produção"
                  type="text"
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel id="pricing-select-label">Produto</InputLabel>
                <Select
                  labelId="pricing-select-label"
                  name="pricingId"
                  onChange={(e) => setFieldValue("pricingId", e.target.value)}
                  value={values.pricingId}
                  displayEmpty
                >
                  {Array.isArray(pricings) &&
                    pricings.map((pricing) => (
                      <MenuItem key={pricing.id} value={pricing.id}>
                        {pricing.product?.name || pricing.combo?.name}
                      </MenuItem>
                    ))}
                </Select>
                {touched.pricingId && errors.pricingId && (
                  <FormHelperText error={true}>
                    {errors.pricingId}
                  </FormHelperText>
                )}
              </FormControl>
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancelar
                </Button>
                <Button variant="contained" type="submit" color="primary">
                  Salvar
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddProductionSimulator;
