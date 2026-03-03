import React from 'react';
import MuiStepper, { StepperProps as MuiStepperProps } from '@mui/material/Stepper';
import MuiStep from '@mui/material/Step';
import MuiStepLabel from '@mui/material/StepLabel';
import MuiStepContent from '@mui/material/StepContent';
import { BaseComponentProps } from '../../../types';

export interface Step {
  label: string;
  description?: string;
  disabled?: boolean;
  completed?: boolean;
  content?: React.ReactNode;
}

export interface StepperProps extends Omit<MuiStepperProps, 'children'>, BaseComponentProps {
  /**
   * Steps to display
   */
  steps: Step[];
  /**
   * The active step index (zero-based)
   */
  activeStep: number;
  /**
   * The orientation of the stepper
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * If true, displays step content
   */
  showContent?: boolean;
  /**
   * If true, displays step descriptions
   */
  showDescription?: boolean;
}

/**
 * Stepper component for displaying multi-step processes
 * Extends MUI Stepper with custom styling
 */
export const Stepper: React.FC<StepperProps> = ({
  className,
  'data-testid': testId,
  steps,
  activeStep,
  orientation = 'horizontal',
  showContent = false,
  showDescription = true,
  ...props
}) => {
  return (
    <MuiStepper
      className={className}
      data-testid={testId}
      activeStep={activeStep}
      orientation={orientation}
      {...props}
    >
      {steps.map((step, index) => (
        <MuiStep key={index} completed={step.completed} disabled={step.disabled}>
          <MuiStepLabel>
            {step.label}
            {showDescription && step.description && (
              <div style={{ fontSize: '0.875rem', color: 'text.secondary', marginTop: '4px' }}>
                {step.description}
              </div>
            )}
          </MuiStepLabel>
          {showContent && orientation === 'vertical' && step.content && (
            <MuiStepContent>{step.content}</MuiStepContent>
          )}
        </MuiStep>
      ))}
    </MuiStepper>
  );
};

